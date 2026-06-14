import {
  Body, Controller, Get, Param, Patch, Post, Delete, Query, Req, UseGuards, BadRequestException, UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateParkingUseCase } from './use-cases/create-parking.usecase';
import { CreateParkingDto } from './dto/create-parking.dto';
import { UpdateParkingDto } from './dto/update-parking.dto';
import { ParkingRepository } from './repositories/parking.repository';
import { JwtGuard } from 'src/common/auth/jwt.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { GetRecommendedParkingsUseCase } from './use-cases/get-recommended-parkings.use-case';
@ApiTags('Parkings')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
@Controller('parkings')
export class ParkingsController {
  constructor(
    private readonly createUC: CreateParkingUseCase,
    private readonly repo: ParkingRepository,
    private readonly getRecommendedParkingsUseCase: GetRecommendedParkingsUseCase,

  ) { }
  @Post('upload-pictures')
  @UseInterceptors(
    FilesInterceptor('pictures', 10, {
      storage: diskStorage({
        destination: './uploads/parkings',
        filename: (req, file, cb) => {
          const fileName = `${Date.now()}-${Math.round(
            Math.random() * 1e9,
          )}${extname(file.originalname)}`;

          cb(null, fileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }

        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  uploadPictures(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length < 3) {
      throw new BadRequestException('At least 3 pictures are required');
    }

    return {
      pictures: files.map(
        (file) => `/uploads/parkings/${file.filename}`,
      ),
    };
  }

  private getUserId(req: any) {
    return req.user?.sub ?? req.user?.id;
  }

  @Post()
  @ApiOperation({ summary: 'Create a parking' })
  @ApiResponse({ status: 201, description: 'Parking created' })
  create(@Req() req: any, @Body() dto: CreateParkingDto) {
    console.log("dto creating parking:" + dto);
    return this.createUC.execute(this.getUserId(req), dto);
  }

  @Get()
  @ApiOperation({ summary: 'List my parkings (optionally filter by zoneId)' })
  @ApiQuery({ name: 'zoneId', required: false, example: 'uuid-zone-id' })
  list(@Req() req: any, @Query('zoneId') zoneId?: string) {
    return this.repo.list(this.getUserId(req), zoneId);
  }

  @Get('all')
  @ApiOperation({ summary: 'List all parkings (non-archived) for any connected user' })
  @ApiQuery({ name: 'zoneId', required: false, example: 'uuid-zone-id' })
  listAll(@Query('zoneId') zoneId?: string) {
    return this.repo.listAllActive(zoneId);
  }
  @Get('recommended')
  @ApiOperation({ summary: 'Get AI recommended parkings' })
  getRecommendedParkings() {
    return this.getRecommendedParkingsUseCase.execute();
  }
  
  @Get(':id')
  @ApiOperation({ summary: 'Get parking by id' })
  @ApiParam({ name: 'id', example: 'uuid-parking-id' })
  get(@Req() req: any, @Param('id') id: string) {
    return this.repo.findById(id, this.getUserId(req));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update parking' })
  @ApiParam({ name: 'id', example: 'uuid-parking-id' })
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateParkingDto) {
    console.log("update parking start now ...");

    return this.repo.update(id, this.getUserId(req), dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Archive parking (soft delete)' })
  @ApiParam({ name: 'id', example: 'uuid-parking-id' })
  archive(@Req() req: any, @Param('id') id: string) {
    return this.repo.archive(id, this.getUserId(req));
  }

}
