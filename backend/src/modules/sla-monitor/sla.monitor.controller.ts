import { Controller, Post, Get, Delete } from '@nestjs/common';
import { SlaMonitorService } from './sla.monitor.service';

@Controller('sla-monitor')
export class SlaMonitorController {
  constructor(private readonly slaMonitorService: SlaMonitorService) {}

  @Post('trigger')
  async triggerSlaCheck() {
    return this.slaMonitorService.triggerSlaCheck();
  }

  @Get('status')
  async getQueueStatus() {
    return this.slaMonitorService.getQueueStatus();
  }

  @Get('statistics')
  async getSlaStatistics() {
    return this.slaMonitorService.getSlaStatistics();
  }

  @Delete('jobs')
  async clearCompletedJobs() {
    return this.slaMonitorService.clearCompletedJobs();
  }
}