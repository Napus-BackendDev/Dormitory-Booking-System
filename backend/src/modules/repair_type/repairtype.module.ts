import { Module } from '@nestjs/common';
import { RepairTypeController } from './repair_type.controller';
import { RepairTypeService } from './repairtype.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [RepairTypeController],
  providers: [RepairTypeService],
})
export class RepairTypeModule {}

