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
  private client: Client | null = null; // optional client when no token provided

  constructor(private prisma: PrismaService) {
    const token = process.env.LINE_ACCESS_TOKEN;
    if (!token) {
      // Do not throw during bootstrap — allow the app to run without LINE configured
      // but warn so developers know to set the env var in their environment.
      // Calls to sendMessage will be no-ops and return a helpful result.
      // This prevents the "no channel access token" error from crashing the app on startup.
      // eslint-disable-next-line no-console
      console.warn('[LineService] LINE_ACCESS_TOKEN is not set. LINE messages will be disabled.');
      this.client = null;
      return;
    }

    this.client = new Client({
      channelAccessToken: token,
    });
  }

  async sendMessage(userId: string, message: string) {
    if (!this.client) {
      // LINE not configured — no-op and return informative result
      // eslint-disable-next-line no-console
      console.debug(`[LineService] Skipping pushMessage to ${userId} because LINE client is not configured.`);
      return { success: false, reason: 'line_client_not_configured' };
    }

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

    const results = await Promise.all(userIds.map((userId) => this.sendMessage(userId, message)));
    return { success: true, results };
  }

  async sendLineUpdateTicket(ticket: Ticket) {
  const userIds = await this.prisma.line.findMany().then((lines) => lines.map((line) => line.userId));

  const dueDate = new Date(ticket.dueAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });

  const message = renderTemplate('line-ticket', { ...ticket, dueDate });

  const results = await Promise.all(userIds.map((userId) => this.sendMessage(userId, message)));
  return { success: true, results };
  }
}
