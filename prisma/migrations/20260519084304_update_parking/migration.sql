/*
  Warnings:

  - You are about to drop the column `vehicleTypes` on the `Tariff` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Parking" ADD COLUMN     "availablePlaces" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "maxPlaces" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "vehicleTypes" "ParkingVehicleType"[];

-- AlterTable
ALTER TABLE "Tariff" DROP COLUMN "vehicleTypes";
