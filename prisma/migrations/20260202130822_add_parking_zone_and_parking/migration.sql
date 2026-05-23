-- CreateEnum
CREATE TYPE "ParkingType" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "ParkingStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "AccessMode" AS ENUM ('FREQUENT', 'OCCASIONAL');

-- CreateTable
CREATE TABLE "ParkingZone" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "geometry" JSONB NOT NULL,
    "auditorId" TEXT NOT NULL,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParkingZone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parking" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ParkingType" NOT NULL,
    "location" JSONB NOT NULL,
    "status" "ParkingStatus" NOT NULL DEFAULT 'ACTIVE',
    "accessMode" "AccessMode" NOT NULL,
    "zoneId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Parking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ParkingZone_auditorId_idx" ON "ParkingZone"("auditorId");

-- CreateIndex
CREATE INDEX "ParkingZone_city_idx" ON "ParkingZone"("city");

-- CreateIndex
CREATE INDEX "Parking_zoneId_idx" ON "Parking"("zoneId");

-- CreateIndex
CREATE INDEX "Parking_ownerId_idx" ON "Parking"("ownerId");

-- CreateIndex
CREATE INDEX "Parking_status_idx" ON "Parking"("status");

-- AddForeignKey
ALTER TABLE "ParkingZone" ADD CONSTRAINT "ParkingZone_auditorId_fkey" FOREIGN KEY ("auditorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parking" ADD CONSTRAINT "Parking_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "ParkingZone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parking" ADD CONSTRAINT "Parking_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
