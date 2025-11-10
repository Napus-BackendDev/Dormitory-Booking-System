import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class SlaMonitorService {
  constructor(
    @InjectQueue('sla-monitor') private slaQueue: Queue,
    private prisma: PrismaService
  ) {}

  // Method to manually trigger SLA check for testing
  async triggerSlaCheck() {
    await this.slaQueue.add('tick', {}, { delay: 0 });
    return { message: 'SLA check triggered successfully' };
  }

  // Method to get queue status
  async getQueueStatus() {
    const waiting = await this.slaQueue.getWaiting();
    const active = await this.slaQueue.getActive();
    const completed = await this.slaQueue.getCompleted();
    const failed = await this.slaQueue.getFailed();

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
      totalJobs: waiting.length + active.length + completed.length + failed.length
    };
  }

  // Method to get SLA statistics grouped by three categories
  async getSlaStatistics() {
    const now = new Date();

    // Get all tickets with SLA information
    const allTickets = await this.prisma.ticket.findMany({
      select: {
        id: true,
        code: true,
        title: true,
        status: true,
        priority: true,
        createdAt: true,
        slaResponseDueAt: true,
        slaResolveDueAt: true,
        responseWarnAt: true,
        resolveWarnAt: true,
        responseBreached: true,
        resolvedBreached: true,
      }
    });

    // Group tickets by status categories
    const workdone = allTickets.filter(ticket => ticket.status === 'completed');
    const onrepair = allTickets.filter(ticket => ['in_progress', 'assigned'].includes(ticket.status));
    const opening = allTickets.filter(ticket => ['open', 'pending'].includes(ticket.status));

    // Calculate SLA statistics for each group
    const calculateGroupStats = (tickets: typeof allTickets) => {
      const total = tickets.length;
      const withSla = tickets.filter(t => t.slaResponseDueAt && t.slaResolveDueAt);

      // Response SLA stats
      const responseBreached = withSla.filter(t => t.responseBreached).length;
      const responseWarning = withSla.filter(t => t.responseWarnAt && !t.responseBreached).length;
      const responseOnTime = withSla.filter(t => !t.responseWarnAt && !t.responseBreached).length;

      // Resolve SLA stats
      const resolveBreached = withSla.filter(t => t.resolvedBreached).length;
      const resolveWarning = withSla.filter(t => t.resolveWarnAt && !t.resolvedBreached).length;
      const resolveOnTime = withSla.filter(t => !t.resolveWarnAt && !t.resolvedBreached).length;

      // Priority breakdown
      const priorityBreakdown = {
        P1: tickets.filter(t => t.priority === 'P1').length,
        P2: tickets.filter(t => t.priority === 'P2').length,
        P3: tickets.filter(t => t.priority === 'P3').length,
        P4: tickets.filter(t => t.priority === 'P4').length,
      };

      return {
        total,
        withSla: withSla.length,
        responseSla: {
          onTime: responseOnTime,
          warning: responseWarning,
          breached: responseBreached,
          complianceRate: withSla.length > 0 ? ((responseOnTime + responseWarning) / withSla.length * 100).toFixed(1) : '0.0'
        },
        resolveSla: {
          onTime: resolveOnTime,
          warning: resolveWarning,
          breached: resolveBreached,
          complianceRate: withSla.length > 0 ? ((resolveOnTime + resolveWarning) / withSla.length * 100).toFixed(1) : '0.0'
        },
        priorityBreakdown
      };
    };

    const queueStats = await this.getQueueStatus();

    return {
      timestamp: now.toISOString(),
      queue: queueStats,
      groups: {
        workdone: calculateGroupStats(workdone),
        onrepair: calculateGroupStats(onrepair),
        opening: calculateGroupStats(opening)
      },
      summary: {
        totalTickets: allTickets.length,
        slaCompliance: {
          overall: allTickets.length > 0 ?
            ((workdone.length + onrepair.length + opening.length) / allTickets.length * 100).toFixed(1) : '0.0'
        }
      }
    };
  }

  // Method to clear completed jobs (for maintenance)
  async clearCompletedJobs() {
    await this.slaQueue.clean(0, 'completed');
    await this.slaQueue.clean(0, 'failed');
    return { message: 'Completed and failed jobs cleared' };
  }
}