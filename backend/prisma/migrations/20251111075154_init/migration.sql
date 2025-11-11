/*
  Warnings:

  - You are about to drop the `Attachment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TicketEvent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Attachment" DROP CONSTRAINT "Attachment_ticketId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TicketEvent" DROP CONSTRAINT "TicketEvent_ticketId_fkey";

-- DropTable
DROP TABLE "public"."Attachment";

-- DropTable
DROP TABLE "public"."TicketEvent";
