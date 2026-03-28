import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { z } from 'zod';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private prisma: PrismaService) {}

  @Get('mine')
  async mine(@Req() req: any) {
    const companyId = req.user?.companyId ?? null;
    if (!companyId) return { ok: false, error: 'Sem companyId no token', users: [] };

    const users = await this.prisma.user.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, name: true, isActive: true, createdAt: true },
      take: 200,
    });

    return { ok: true, users };
  }

  @Post()
  async create(@Req() req: any, @Body() body: any) {
    const companyId = req.user?.companyId ?? null;
    if (!companyId) return { ok: false, error: 'Sem companyId no token' };

    const schema = z.object({
      email: z.string().email(),
      name: z.string().min(2).optional().default(''),
      password: z.string().min(8),
      isActive: z.boolean().optional().default(true),
    });

    const data = schema.parse(body);
    const email = data.email.toLowerCase();
    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.upsert({
      where: { companyId_email: { companyId, email } },
      update: { name: data.name, passwordHash, isActive: data.isActive },
      create: { companyId, email, name: data.name, passwordHash, isActive: data.isActive },
      select: { id: true, email: true, name: true, companyId: true, isActive: true, createdAt: true },
    });

    return { ok: true, user };
  }
}
