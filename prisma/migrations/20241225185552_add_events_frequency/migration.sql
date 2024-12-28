-- CreateEnum
CREATE TYPE "EventFrequency" AS ENUM ('ONCE', 'WEEKLY');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "frequency" "EventFrequency" NOT NULL DEFAULT 'ONCE';
