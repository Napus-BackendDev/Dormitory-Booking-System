-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "acknowledgedAt" TIMESTAMP(3),
ADD COLUMN     "onHoldSeconds" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "resolveWarnAt" TIMESTAMP(3),
ADD COLUMN     "resolvedAt" TIMESTAMP(3),
ADD COLUMN     "resolvedBreached" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "responseBreached" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "responseWarnAt" TIMESTAMP(3),
ADD COLUMN     "slaResolveDueAt" TIMESTAMP(3),
ADD COLUMN     "slaResponseDueAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Ticket_status_slaResponseDueAt_idx" ON "Ticket"("status", "slaResponseDueAt");

-- CreateIndex
CREATE INDEX "Ticket_status_slaResolveDueAt_idx" ON "Ticket"("status", "slaResolveDueAt");
