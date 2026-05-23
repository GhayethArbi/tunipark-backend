
import { Body, Controller, Get, Param, Patch, Post, Delete, Req, UseGuards } from '@nestjs/common';
import { CreateParkingZoneUseCase } from './use-cases/create-parking-zone.usecase';
import { UpdateParkingZoneDto } from './dto/update-parking-zone.dto';
import { CreateParkingZoneDto } from './dto/create-parking-zone.dto';
import { ParkingZoneRepository } from './repositories/parking-zone.repository';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/auth/current-user.decorator';
import { JwtGuard } from 'src/common/auth/jwt.guard';

@ApiTags('Parking Zones')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
@Controller('parking-zones')
export class ParkingZonesController {
  constructor(
    private readonly createUC: CreateParkingZoneUseCase,
    private readonly repo: ParkingZoneRepository, // for quick list/get; can also create dedicated use-cases
  ) { }

  // IMPORTANT: adapt how you get userId from JWT (req.user.sub, req.user.id, etc.)
  private getUserId(req: any) {
    console.log("req : ", req);
    return req.user?.sub ?? req.user?.id;
  }

  @Post()
  @ApiOperation({ summary: 'Create a parking zone' })
  @ApiResponse({ status: 201, description: 'Parking zone created' })
  create(@CurrentUser() user: any, @Body() dto: CreateParkingZoneDto) {
    return this.createUC.execute(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List my parking zones' })
  list(@Req() req: any) {
    return this.repo.list(this.getUserId(req));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get parking zone by id' })
  @ApiParam({ name: 'id', example: 'uuid-zone-id' })
  get(@Req() req: any, @Param('id') id: string) {
    return this.repo.findById(id, this.getUserId(req));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update parking zone' })
  @ApiParam({ name: 'id', example: 'uuid-zone-id' })
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateParkingZoneDto) {
    return this.repo.update(id, this.getUserId(req), dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Archive parking zone (soft delete)' })
  @ApiParam({ name: 'id', example: 'uuid-zone-id' })
  archive(@Req() req: any, @Param('id') id: string) {
    return this.repo.archive(id, this.getUserId(req));
  }
}
