/*
  Warnings:

  - Made the column `staticMapUrl` on table `ride` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ride" ALTER COLUMN "staticMapUrl" SET NOT NULL;
