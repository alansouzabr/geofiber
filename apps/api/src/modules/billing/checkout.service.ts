import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CheckoutService {
  constructor(private prisma: PrismaService) {}

  async createCheckoutSession(priceId: string, companyId: string) {
    // Funcionalidade temporariamente desabilitada
    return { url: '#' };
  }
}
