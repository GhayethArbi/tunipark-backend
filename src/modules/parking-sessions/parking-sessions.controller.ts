import { Body, Controller, Get, Param, Patch, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/common/auth/jwt.guard';
import { CurrentUser } from 'src/common/auth/current-user.decorator';

import { CreateParkingSessionDto } from './dto/create-parking-session.dto';
import { EndParkingSessionDto } from './dto/end-parking-session.dto';

import { CreateParkingSessionUseCase } from './use-cases/create-parking-session.usecase';
import { GetParkingSessionUseCase } from './use-cases/get-parking-session.usecase';
import { ListParkingSessionsUseCase } from './use-cases/list-parking-sessions.usecase';
import { ListActiveParkingSessionsUseCase } from './use-cases/list-active-parking-sessions.usecase';
import { ListSessionsByParkingUseCase } from './use-cases/list-sessions-by-parking.usecase';
import { EndParkingSessionUseCase } from './use-cases/end-parking-session.usecase';
import { CancelParkingSessionUseCase } from './use-cases/cancel-parking-session.usecase';
import { GetUserParkingSessionsUseCase } from './use-cases/get-user-parking-sessions.usecase';

@ApiTags('Parking Sessions')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
@Controller('parking-sessions')
export class ParkingSessionsController {
  constructor(
    private readonly createUC: CreateParkingSessionUseCase,
    private readonly getUC: GetParkingSessionUseCase,
    private readonly listUC: ListParkingSessionsUseCase,
    private readonly listActiveUC: ListActiveParkingSessionsUseCase,
    private readonly listByParkingUC: ListSessionsByParkingUseCase,
    private readonly endUC: EndParkingSessionUseCase,
    private readonly cancelUC: CancelParkingSessionUseCase,
    private readonly getUserParkingSessionsUseCase: GetUserParkingSessionsUseCase,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Start a parking session (ACTIVE)' })
  create(@CurrentUser() user: any, @Body() dto: CreateParkingSessionDto) {
    console.log("create session start now ...");
    if (!user?.id && !user?.sub) throw new UnauthorizedException('Missing user');
    const userId = user.id ?? user.sub;
    console.log("userId:", userId);
    return this.createUC.execute(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all sessions (non-archived)' })
  listAll() {
    return this.listUC.execute();
  }

  @Get('active')
  @ApiOperation({ summary: 'List active sessions' })
  listActive() {
    return this.listActiveUC.execute();
  }
  @Get('me')
  async getMySessions(@CurrentUser() user: any) {
    console.log("getMySessions called");
    if (!user?.id && !user?.sub) throw new UnauthorizedException('Missing user');
    const userId = user.id ?? user.sub;
    return this.getUserParkingSessionsUseCase.execute(userId);
  }
  @Get('by-parking/:parkingId')
  @ApiOperation({ summary: 'List sessions by parkingId' })
  @ApiParam({ name: 'parkingId', example: 'uuid-parking-id' })
  listByParking(@Param('parkingId') parkingId: string) {
    return this.listByParkingUC.execute(parkingId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get session by id' })
  @ApiParam({ name: 'id', example: 'uuid-session-id' })
  get(@Param('id') id: string) {
    return this.getUC.execute(id);
  }

  @Patch(':id/end')
  @ApiOperation({ summary: 'End a session (EXPIRED)' })
  @ApiParam({ name: 'id', example: 'uuid-session-id' })
  end(@Param('id') id: string, @Body() _dto: EndParkingSessionDto) {
    return this.endUC.execute(id);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel a session (CANCELLED)' })
  @ApiParam({ name: 'id', example: 'uuid-session-id' })
  cancel(@Param('id') id: string) {
    return this.cancelUC.execute(id);
  }

}
