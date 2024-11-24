/*
  Warnings:

  - Added the required column `likes` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN "likes" INTEGER NOT NULL DEFAULT 0;
