import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { WebhookController } from './webhook.controller';
import { CheckoutService } from './checkout.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BillingController, WebhookController],
  providers: [CheckoutService],
})
export class BillingModule {}
