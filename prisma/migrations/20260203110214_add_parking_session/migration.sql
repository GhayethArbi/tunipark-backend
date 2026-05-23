-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('CREATED', 'ACTIVE', 'EXPIRED', 'CANCELLED');

-- CreateTable
CREATE TABLE "ParkingSession" (
    "id" TEXT NOT NULL,
    "parkingId" TEXT NOT NULL,
    "vehiclePlate" TEXT NOT NULL,
    "vehicleBrand" TEXT,
    "vehicleModel" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "status" "SessionStatus" NOT NULL DEFAULT 'CREATED',
    "paidDuration" INTEGER NOT NULL DEFAULT 0,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParkingSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ParkingSession_parkingId_idx" ON "ParkingSession"("parkingId");

-- CreateIndex
CREATE INDEX "ParkingSession_status_idx" ON "ParkingSession"("status");

-- CreateIndex
CREATE INDEX "ParkingSession_vehiclePlate_idx" ON "ParkingSession"("vehiclePlate");

-- AddForeignKey
ALTER TABLE "ParkingSession" ADD CONSTRAINT "ParkingSession_parkingId_fkey" FOREIGN KEY ("parkingId") REFERENCES "Parking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
