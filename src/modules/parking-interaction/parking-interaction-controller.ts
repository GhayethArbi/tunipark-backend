import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { LogParkingViewDto } from './dto/log-parking-view.dto';
import { JwtGuard } from 'src/common/auth/jwt.guard';
import { ParkingInteractionType } from './domain/parking-interaction-type.enum';
import { LogParkingInteractionUseCase } from './use-cases/log-parking-interaction.use-case';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindParkingInteractionsUseCase } from './use-cases/find-parking-interactions.use-case';
import { GetParkingAiScoreUseCase } from './use-cases/get-parking-ai-score.use-case';

@ApiTags('Parking Interactions')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
@Controller('parking-interactions')
export class ParkingInteractionController {
    constructor(
        private readonly logParkingInteractionUseCase: LogParkingInteractionUseCase,
        private readonly findParkingInteractionsUseCase: FindParkingInteractionsUseCase,
        private readonly getParkingAiScoreUseCase: GetParkingAiScoreUseCase,
    ) { }

    @UseGuards(JwtGuard)
    @ApiOperation({ summary: 'view interactions' })
    @Post('view')
    async logView(@Req() req, @Body() dto: LogParkingViewDto) {
        console.log("log parking view interaction ...");
        const userId = req.user.id;
        await this.logParkingInteractionUseCase.execute({
            userId,
            parkingId: dto.parkingId,
            interactionType: ParkingInteractionType.VIEW,
        });
        return { success: true, };
    }
    
    @ApiOperation({ summary: 'Get latest interactions' })
    @Get()
    async findAll() {
        return this.findParkingInteractionsUseCase.execute();
    }
    
    @ApiOperation({ summary: 'Get AI score for a parking' })
    @Get(':parkingId/score')
    async getScore(@Param('parkingId') parkingId: string) {
        return this.getParkingAiScoreUseCase.execute(parkingId);
    }
}
