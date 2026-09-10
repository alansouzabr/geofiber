import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-03-25.dahlia', // 🔥 versão correta
  });

  async createCheckoutSession(plan: any, companyId: string) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: plan.name,
            },
            unit_amount: Math.round(plan.price * 100),
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      success_url: `https://painel.geofibers.com.br/dashboard?success=true`,
      cancel_url: `https://painel.geofibers.com.br/dashboard?canceled=true`,
      metadata: {
        companyId,
        planId: plan.id,
      },
    });

    return { url: session.url };
  }
}
