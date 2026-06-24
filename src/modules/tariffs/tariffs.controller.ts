import { Body, Controller, Delete, Get, Param, Patch, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/common/auth/jwt.guard';
import { CurrentUser } from 'src/common/auth/current-user.decorator';
import { CreateTariffDto } from './dto/create-tariff.dto';
import { UpdateTariffDto } from './dto/update-tariff.dto';
import { CreateTariffUseCase } from './use-cases/create-tariff.usecase';
import { TariffRepository } from './repositories/tariff.repository';
import { UpdateTariffByParkingUseCase } from './use-cases/update-tariff-by-parking.usecase';
import { UpdateTariffByParkingDto } from './dto/update-tariff-by-parking.dto';

@ApiTags('Tariffs')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
@Controller('tariffs')
export class TariffsController {
  constructor(
    private readonly createUC: CreateTariffUseCase,
    private readonly updateByParkingUC: UpdateTariffByParkingUseCase,

    private readonly repo: TariffRepository,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create tariff for a parking (1-1)' })
  create(@CurrentUser() user: any, @Body() dto: CreateTariffDto) {
    console.log("create tariff ....");
    console.log("tariff dto ...." + dto.pricePerDay);

    if (!user?.id) throw new UnauthorizedException('Missing user');
    return this.createUC.execute(user.id, dto);
  }

  @Get('by-parking/:parkingId')
  @ApiOperation({ summary: 'Get tariff by parking id' })
  @ApiParam({ name: 'parkingId', example: 'uuid-parking-id' })
  getByParking(@CurrentUser() user: any, @Param('parkingId') parkingId: string) {
    if (!user?.id) throw new UnauthorizedException('Missing user');
    console.log("getByParking called with parkingId:", parkingId, "and userId:", user.id);
    return this.repo.findByParkingId(parkingId, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update tariff' })
  @ApiParam({ name: 'id', example: 'uuid-tariff-id' })
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: UpdateTariffDto) {
    console.log("update ârking controller start...");
    if (!user?.id) throw new UnauthorizedException('Missing user');
    return this.repo.update(id, user.id, dto);
  }


  @Patch('by-parking/:parkingId')
  @ApiOperation({ summary: 'Update tariff by parking id' })
  @ApiParam({ name: 'parkingId', example: 'uuid-parking-id' })
  updateByParking(
    @CurrentUser() user: any,
    @Param('parkingId') parkingId: string,
    @Body() dto: UpdateTariffByParkingDto,
  ) {
    if (!user?.id) throw new UnauthorizedException('Missing user');

    return this.updateByParkingUC.execute(
      user.id,
      parkingId,
      dto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Archive tariff (soft delete)' })
  @ApiParam({ name: 'id', example: 'uuid-tariff-id' })
  archive(@CurrentUser() user: any, @Param('id') id: string) {
    if (!user?.id) throw new UnauthorizedException('Missing user');
    return this.repo.archive(id, user.id);
  }
}
