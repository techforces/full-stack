-- CreateEnum
CREATE TYPE "UnitImageStatus" AS ENUM ('NONE', 'PENDING', 'READY', 'FAILED');

-- AlterTable
ALTER TABLE "Unit" ADD COLUMN     "image" BYTEA,
ADD COLUMN     "imageStatus" "UnitImageStatus" NOT NULL DEFAULT 'NONE';
