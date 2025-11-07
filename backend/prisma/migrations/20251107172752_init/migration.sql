/*
  Warnings:

  - You are about to drop the column `test` on the `Ticket` table. All the data in the column will be lost.
  - The `photo` column on the `Ticket` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "test",
DROP COLUMN "photo",
ADD COLUMN     "photo" TEXT[];
