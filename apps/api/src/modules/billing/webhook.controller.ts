import { Controller, Post, Body } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('billing/webhook')
export class WebhookController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handleWebhook(@Body() body: any) {
    // Webhook temporariamente desabilitado
    return { received: true };
  }
}
