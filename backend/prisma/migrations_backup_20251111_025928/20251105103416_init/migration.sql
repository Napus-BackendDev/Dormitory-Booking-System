/*
  Warnings:

  - Added the required column `createdBy` to the `TicketEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TicketEvent" ADD COLUMN     "createdBy" TEXT NOT NULL;
