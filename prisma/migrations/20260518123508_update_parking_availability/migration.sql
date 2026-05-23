-- CreateEnum
CREATE TYPE "ParkingVehicleType" AS ENUM ('SMALL', 'MEDIUM', 'LARGE', 'HIGH', 'MOTO', 'BIKE');

-- AlterTable
ALTER TABLE "Parking" ADD COLUMN     "closingTime" TEXT NOT NULL DEFAULT '22:00',
ADD COLUMN     "openingTime" TEXT NOT NULL DEFAULT '7:00';

-- AlterTable
ALTER TABLE "Tariff" ADD COLUMN     "vehicleTypes" "ParkingVehicleType"[];
