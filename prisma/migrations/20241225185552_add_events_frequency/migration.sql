-- CreateEnum
CREATE TYPE "EventFrequency" AS ENUM ('ONE_TIME', 'WEEKLY');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "frequency" "EventFrequency" NOT NULL DEFAULT 'ONE_TIME';
