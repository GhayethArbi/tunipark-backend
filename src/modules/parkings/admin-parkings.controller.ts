import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/common/auth/jwt.guard';
import { ParkingRepository } from './repositories/parking.repository';
import { ParkingStatus } from './domain/parking.enums';

@ApiTags('Admin — Parkings')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
@Controller('admin/parkings')
export class AdminParkingsController {
  constructor(private readonly repo: ParkingRepository) {}

  @Get()
  @ApiOperation({ summary: 'List all parkings with owner data (admin)' })
  listAll() {
    console.log("admin need list owner");
    return this.repo.listAllWithOwner();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get full parking detail (admin)' })
  @ApiParam({ name: 'id' })
  getOne(@Param('id') id: string) {
    return this.repo.findByIdAdmin(id);    // we add this method below
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Approve a parking' })
  @ApiParam({ name: 'id' })
  approve(@Param('id') id: string) {
    return this.repo.setStatus(id, ParkingStatus.ACTIVE);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Reject / deactivate a parking' })
  @ApiParam({ name: 'id' })
  reject(@Param('id') id: string) {
    return this.repo.setStatus(id, ParkingStatus.INACTIVE);
  }
}