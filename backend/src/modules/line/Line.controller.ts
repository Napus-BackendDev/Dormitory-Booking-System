import { Controller, Post, Body } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { LineService } from './Line.service';

@Controller('line')
export class LineController {
  constructor(private readonly prisma: PrismaService, private readonly service: LineService) {}

  @Post('webhook')
  async handleWebhook(@Body() body: any) {
    console.log('📩 Webhook event:', body);

    const events = body.events;
    if (events && events.length > 0) {
      const event = events[0];
      const userId = event.source?.userId;

      if (userId) {
        const existingUser = await this.prisma.line.findUnique({ where: { userId } });
        if (!existingUser) {
          const userRecord = await this.prisma.line.create({ data: { userId } });
          console.log('ℹ️ User does not exist in the database:', userRecord);
          return 'OK';
        } else {
          console.log('ℹ️ User already exists in the database:');
          return 'OK';
        }
      }
    }

    // ต้องตอบกลับ 200 OK เสมอ
    return 'OK';
  }
}
