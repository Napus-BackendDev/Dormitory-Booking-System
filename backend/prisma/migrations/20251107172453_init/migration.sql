/*
  Warnings:

  - Added the required column `test` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "test" TEXT NOT NULL,
ALTER COLUMN "photo" SET NOT NULL,
ALTER COLUMN "photo" SET DATA TYPE TEXT;
