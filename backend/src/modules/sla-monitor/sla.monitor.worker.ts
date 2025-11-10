import { Processor, Process } from '@nestjs/bull';
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { EmailService } from "../../common/email/email.service";
import { SlaWarningMailer } from 'src/common/email/mail-temp/sla-warning';
import { SlaBreachMailer } from 'src/common/email/mail-temp/sla-breach';

@Injectable()
@Processor('sla-monitor')
export class SlaMonitorWorker{
    constructor(
        private prismaService: PrismaService,
        private emailService: EmailService
    ) {}

    @Process('tick')
    async handle() {
        const now = new Date();
        const soon = new Date(now.getTime() + 15 * 60_000); // 15 min window for warning

        try {
            // 1) WARN: not yet late, but due within 15 mins
            const warnTickets = await this.prismaService.ticket.findMany({
            where: {
                status: { in: ['NEW','TRIAGE','ASSIGNED','IN_PROGRESS'] },
                OR: [
                { acknowledgedAt: null, responseWarnAt: null, slaResponseDueAt: { gt: now, lte: soon } },
                { resolvedAt: null,     resolveWarnAt:  null, slaResolveDueAt:  { gt: now, lte: soon } },
                ],
            },
            });

            for (const t of warnTickets) {
            // Update the ticket with warning timestamps
            await this.prismaService.ticket.update({
                where: { id: t.id },
                data: {
                responseWarnAt: t.acknowledgedAt ? t.responseWarnAt : (t.responseWarnAt ?? now),
                resolveWarnAt: t.resolvedAt ? t.resolveWarnAt : (t.resolveWarnAt ?? now),
                },
            });

            // Create the ticket event separately
            await this.prismaService.ticketEvent.create({
                data: {
                ticketId: t.id,
                type: 'SLA_WARNING',
                note: 'Approaching SLA',
                createdBy: 'system',
                },
            });
            // TODO: send email/LINE here if you want
            try {
                // Determine if this is a response or resolution warning
                const isResponseWarning = !t.acknowledgedAt && t.slaResponseDueAt && t.slaResponseDueAt <= soon && t.slaResponseDueAt > now;
                const slaType = isResponseWarning ? 'response' : 'resolution';
                const dueAt = isResponseWarning ? t.slaResponseDueAt : t.slaResolveDueAt;

                await SlaWarningMailer(
                    this.prismaService,
                    this.emailService,
                    t.id,
                    t.code,
                    t.title,
                    slaType,
                    dueAt!
                );
            } catch (error) {
                console.error('Failed to send SLA warning email:', error);
            }
        }

            // 2) BREACH: deadline passed
            const breachTickets = await this.prismaService.ticket.findMany({
            where: {
                status: { in: ['NEW','TRIAGE','ASSIGNED','IN_PROGRESS'] },
                OR: [
                { acknowledgedAt: null, responseBreached: false, slaResponseDueAt: { lt: now } },
                { resolvedAt: null,     resolvedBreached:  false, slaResolveDueAt:  { lt: now } },
                ],
            },
            });

            for (const t of breachTickets) {
            await this.prismaService.ticket.update({
                where: { id: t.id },
                data: {
                responseBreached: t.acknowledgedAt ? t.responseBreached : true,
                resolvedBreached:  t.resolvedAt     ? t.resolvedBreached  : true,
                },
            });

            // Create the ticket event separately
            await this.prismaService.ticketEvent.create({
                data: {
                ticketId: t.id,
                type: 'SLA_BREACH',
                note: 'SLA breached',
                createdBy: 'system',
                },
            });
            // Send urgent email notification for SLA breach
            try {
                // Determine if this is a response or resolution breach
                const isResponseBreach = !t.acknowledgedAt && t.slaResponseDueAt && t.slaResponseDueAt < now;
                const slaType = isResponseBreach ? 'response' : 'resolution';
                const breachedAt = isResponseBreach ? t.slaResponseDueAt : t.slaResolveDueAt;

                await SlaBreachMailer(
                    this.prismaService,
                    this.emailService,
                    t.id,
                    t.code,
                    t.title,
                    slaType,
                    breachedAt!
                );
            } catch (error) {
                console.error('Failed to send SLA breach email:', error);
            }
            }
        } catch (error) {
            console.error('SLA Monitor Worker Error:', error);
            throw error;
        }
    }
}