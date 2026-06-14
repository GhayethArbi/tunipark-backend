import { Inject, Injectable } from '@nestjs/common';
import { PARKING_INTERACTION_REPOSITORY, ParkingInteractionRepository } from '../repositories/parking-interaction.repository';


@Injectable()
export class FindParkingInteractionsUseCase {
    constructor(
        @Inject(PARKING_INTERACTION_REPOSITORY)
        private readonly repository: ParkingInteractionRepository,
    ) { }

    async execute() {
        return this.repository.findLatest();
    }
}