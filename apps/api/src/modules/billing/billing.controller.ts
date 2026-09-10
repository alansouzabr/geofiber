import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('billing')
export class BillingController {
  constructor(private checkout: CheckoutService) {}

  @UseGuards(JwtAuthGuard)
  @Post('checkout')

  create(
    @Req() req: any,
    @Body() body: any
  ) {

    return this.checkout.createCheckoutSession(
      body.planId,
      req.user.companyId
    );
  }
}
