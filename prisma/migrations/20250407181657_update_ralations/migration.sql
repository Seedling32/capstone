/*
  Warnings:

  - You are about to drop the `_locationToride` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_locationTouser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_locationToride" DROP CONSTRAINT "_locationToride_A_fkey";

-- DropForeignKey
ALTER TABLE "_locationToride" DROP CONSTRAINT "_locationToride_B_fkey";

-- DropForeignKey
ALTER TABLE "_locationTouser" DROP CONSTRAINT "_locationTouser_A_fkey";

-- DropForeignKey
ALTER TABLE "_locationTouser" DROP CONSTRAINT "_locationTouser_B_fkey";

-- DropTable
DROP TABLE "_locationToride";

-- DropTable
DROP TABLE "_locationTouser";

-- AddForeignKey
ALTER TABLE "ride" ADD CONSTRAINT "ride_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
