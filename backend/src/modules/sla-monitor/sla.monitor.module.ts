import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { SlaMonitorController } from './sla.monitor.controller';
import { SlaMonitorService } from './sla.monitor.service';
import { SlaMonitorScheduler } from './sla.monitor.scheduler';
import { SlaMonitorWorker } from './sla.monitor.worker';
import { PrismaService } from '../../common/prisma.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'sla-monitor',
    }),
  ],
  controllers: [SlaMonitorController],
  providers: [
    SlaMonitorService,
    SlaMonitorScheduler,
    SlaMonitorWorker,
    PrismaService
  ],
  exports: [SlaMonitorService],
})
export class SlaMonitorModule {}