-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailResetOtpExpiresAt" TIMESTAMP(3),
ADD COLUMN     "emailResetOtpHash" TEXT,
ADD COLUMN     "phoneResetOtpExpiresAt" TIMESTAMP(3),
ADD COLUMN     "phoneResetOtpHash" TEXT;
