import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../modules/prisma/prisma.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest();
    const res = http.getResponse();

    const user = req.user || null;
    const companyId = user?.companyId || null;
    const actorUserId = user?.userId || null;

    const method = req.method;
    const path = req.originalUrl || req.url;
    const ip =
      req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      null;
    const ua = req.headers['user-agent'] || null;

    const startedAt = Date.now();

    return next.handle().pipe(
      tap({
        next: async () => {
          // Só audita se tiver companyId (rotas públicas como /health não precisam)
          if (!companyId) return;

          const ms = Date.now() - startedAt;
          const statusCode = res.statusCode;

          // Evitar logar body/senhas: metadados enxutos
          await this.prisma.auditLog.create({
            data: {
              companyId,
              actorUserId,
              action: `HTTP ${method} ${path}`,
              entity: 'HTTP',
              entityId: null,
              metadata: {
                statusCode,
                ms,
                ip,
                ua,
              },
            },
          });
        },
      }),
    );
  }
}
