-- AlterTable
ALTER TABLE "Parking" ALTER COLUMN "openingTime" SET DEFAULT '07:00',
ALTER COLUMN "availablePlaces" SET DEFAULT 1,
ALTER COLUMN "maxPlaces" SET DEFAULT 1,
ALTER COLUMN "vehicleTypes" SET DEFAULT ARRAY[]::"ParkingVehicleType"[];
