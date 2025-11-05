/*
  Warnings:

  - You are about to drop the `Surveys` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."Surveys";

-- CreateTable
CREATE TABLE "Survey" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "comment" TEXT,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Survey_ticketId_key" ON "Survey"("ticketId");
