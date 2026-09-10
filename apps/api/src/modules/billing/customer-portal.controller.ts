import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

@Controller('billing')
export class CustomerPortalController {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-03-25.dahlia',
  });

  constructor(private prisma: PrismaService) {}

  @UseGuards(JwtAuthGuard)
  @Post('portal')
  async portal(@CurrentUser() user: any) {
    const company = await this.prisma.company.findUnique({
      where: { id: user.companyId },
    });

    const session = await this.stripe.billingPortal.sessions.create({
      customer: undefined, // 🔥 vamos salvar isso depois
      return_url: 'https://painel.geofibers.com.br/dashboard',
    });

    return { url: session.url };
  }
}
