import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LogParkingViewDto } from './dto/log-parking-view.dto';
import { JwtGuard } from 'src/common/auth/jwt.guard';
import { ParkingInteractionType } from './domain/parking-interaction-type.enum';
import { LogParkingInteractionUseCase } from './use-cases/log-parking-interaction.use-case';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';


@ApiTags('Parking Interactions') 
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
@Controller('parking-interactions')
export class ParkingInteractionController {
    constructor(
        private readonly logParkingInteractionUseCase: LogParkingInteractionUseCase,
    ) { }

    @UseGuards(JwtGuard)
    @ApiOperation({ summary: 'view interactions' })

    @Post('view')
    async logView(@Req() req, @Body() dto: LogParkingViewDto) {
        const userId = req.user.id;
        await this.logParkingInteractionUseCase.execute(
            { userId, parkingId: dto.parkingId, interactionType: ParkingInteractionType.VIEW, }
        );

        return { success: true, };
    }
}