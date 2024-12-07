-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('DELETED', 'PENDING_CREATION_APPROVAL', 'ACTIVE');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "status" "EventStatus" NOT NULL DEFAULT 'PENDING_CREATION_APPROVAL';

-- Set ACTIVE to all current events
UPDATE "Event" SET "status" = 'ACTIVE';
