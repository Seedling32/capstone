/*
  Warnings:

  - Added the required column `locationId` to the `ride` table without a default value. This is not possible if the table is not empty.
  - Made the column `elevation` on table `ride` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ride" ADD COLUMN     "locationId" INTEGER NOT NULL,
ALTER COLUMN "difficulty" DROP DEFAULT,
ALTER COLUMN "elevation" SET NOT NULL;

-- CreateTable
CREATE TABLE "state" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,

    CONSTRAINT "state_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "location" (
    "id" SERIAL NOT NULL,
    "city" TEXT NOT NULL,
    "stateId" INTEGER NOT NULL,

    CONSTRAINT "location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_locationTouser" (
    "A" INTEGER NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_locationTouser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_locationToride" (
    "A" INTEGER NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_locationToride_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "state_abbreviation_key" ON "state"("abbreviation");

-- CreateIndex
CREATE INDEX "_locationTouser_B_index" ON "_locationTouser"("B");

-- CreateIndex
CREATE INDEX "_locationToride_B_index" ON "_locationToride"("B");

-- AddForeignKey
ALTER TABLE "location" ADD CONSTRAINT "location_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "state"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_locationTouser" ADD CONSTRAINT "_locationTouser_A_fkey" FOREIGN KEY ("A") REFERENCES "location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_locationTouser" ADD CONSTRAINT "_locationTouser_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_locationToride" ADD CONSTRAINT "_locationToride_A_fkey" FOREIGN KEY ("A") REFERENCES "location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_locationToride" ADD CONSTRAINT "_locationToride_B_fkey" FOREIGN KEY ("B") REFERENCES "ride"("ride_id") ON DELETE CASCADE ON UPDATE CASCADE;
