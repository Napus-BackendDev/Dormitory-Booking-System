import Handlebars from 'handlebars';
import { Injectable } from '@nestjs/common';
import { Ticket } from '@prisma/client';
import { PrismaService } from 'src/common/prisma.service';
import { Client } from '@line/bot-sdk';
import * as fs from 'fs';
import * as path from 'path';


function renderTemplate(templateName: string, data: any): string {
  const templatePath = path.join(process.cwd(), 'dist', 'src', 'templates', `${templateName}.hbs`);
  const source = fs.readFileSync(templatePath, 'utf8');
  const template = Handlebars.compile(source);
  return template(data);
}

@Injectable()
export class LineService {
  private client: Client; // ✅ ประกาศก่อน

  constructor(private prisma: PrismaService) {
    const token = process.env.LINE_ACCESS_TOKEN!;
    this.client = new Client({
      channelAccessToken: token,
    });
  }

  async sendMessage(userId: string, message: string) {
    await this.client.pushMessage(userId, {
      type: 'text',
      text: message,
    });
    return { success: true };
  }

  async sendLineCreateTicket(ticket: Ticket) {
    const userIds = await this.prisma.line.findMany().then((lines) => lines.map((line) => line.userId));

    const dueDate = new Date(ticket.dueAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });

    const message = renderTemplate('line-ticket', { ...ticket, dueDate});

    await Promise.all(userIds.map((userId) => this.sendMessage(userId, message)));
    return { success: true };
  }

  async sendLineUpdateTicket(ticket: Ticket) {
  const userIds = await this.prisma.line.findMany().then((lines) => lines.map((line) => line.userId));

  const dueDate = new Date(ticket.dueAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });

  const message = renderTemplate('line-ticket', { ...ticket, dueDate });

  await Promise.all(userIds.map((userId) => this.sendMessage(userId, message)));
  return { success: true };
  }
}
