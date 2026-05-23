-- CreateTable
CREATE TABLE "Tariff" (
    "id" TEXT NOT NULL,
    "pricePerUnit" INTEGER NOT NULL,
    "minDuration" INTEGER NOT NULL,
    "maxDuration" INTEGER NOT NULL,
    "parkingId" TEXT NOT NULL,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tariff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tariff_parkingId_key" ON "Tariff"("parkingId");

-- CreateIndex
CREATE INDEX "Tariff_parkingId_idx" ON "Tariff"("parkingId");

-- AddForeignKey
ALTER TABLE "Tariff" ADD CONSTRAINT "Tariff_parkingId_fkey" FOREIGN KEY ("parkingId") REFERENCES "Parking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
