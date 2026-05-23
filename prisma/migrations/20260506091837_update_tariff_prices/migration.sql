/*
  Warnings:

  - You are about to drop the column `name` on the `Parking` table. All the data in the column will be lost.
  - You are about to drop the column `pricePerUnit` on the `Tariff` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ParkingSpotType" AS ENUM ('COVERED', 'OUTDOOR', 'GARAGE', 'UNDERGROUND');

-- AlterTable
ALTER TABLE "Parking" DROP COLUMN "name",
ADD COLUMN     "characteristics" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "description" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "pictures" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "spotType" "ParkingSpotType" NOT NULL DEFAULT 'OUTDOOR',
ADD COLUMN     "title" TEXT NOT NULL DEFAULT 'Untitled parking',
ALTER COLUMN "type" SET DEFAULT 'PRIVATE';

-- AlterTable
ALTER TABLE "Tariff" DROP COLUMN "pricePerUnit",
ADD COLUMN     "pricePerDay" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "pricePerMonth" DOUBLE PRECISION NOT NULL DEFAULT 0;
