import { Controller, Post, Body } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { LineService } from './Line.service';

@Controller('line')
export class LineController {
  constructor(private readonly prisma: PrismaService, private readonly service: LineService) {}

  @Post('webhook')
  async handleWebhook(@Body() body: any) {

    const events = body.events;
    if (events && events.length > 0) {
      const event = events[0];
      const userId = event.source?.userId;

      if (userId) {
        const existingUser = await this.prisma.line.findUnique({ where: { userId } });
        if (!existingUser) {
          const userRecord = await this.prisma.line.create({ data: { userId } });
          return 'OK';
        } else {
          return 'OK';
        }
      }
    }

    // ต้องตอบกลับ 200 OK เสมอ
    return 'OK';
  }
}
