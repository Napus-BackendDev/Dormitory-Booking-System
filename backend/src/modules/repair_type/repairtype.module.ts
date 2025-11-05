import { Module } from '@nestjs/common';
import { RepairTypeController } from './repair_type.controller';
import { RepairTypeService } from './repairtype.service';

@Module({
  controllers: [RepairTypeController],
  providers: [RepairTypeService],
})
export class RepairTypeModule {}

