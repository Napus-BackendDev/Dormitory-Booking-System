import { Module } from '@nestjs/common';
import { AttachmentModule } from './modules/attachment/attachment.modules';
import { PrismaModule } from './common/prisma.module';

@Module({
  imports: [
    PrismaModule,
    AttachmentModule
  ],
})
export class AppModule {}
