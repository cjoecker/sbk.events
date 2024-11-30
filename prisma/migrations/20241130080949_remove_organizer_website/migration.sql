/*
  Warnings:

  - You are about to drop the column `website` on the `Organizer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "likes" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Organizer" DROP COLUMN "website";
