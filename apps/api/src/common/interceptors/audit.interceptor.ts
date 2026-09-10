import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuditService } from '../../modules/audit/audit.service';
import { generateId } from '../../common/utils/id';

function sanitizeAuditData(data: any): any {

  if (!data || typeof data !== 'object') {
    return data;
  }

  const clone = JSON.parse(JSON.stringify(data));

  const hidden = [
    'password',
    'passwordHash',
    'token',
    'accessToken',
    'refreshToken',
    'authorization',
    'Authorization'
  ];

  const walk = (obj: any) => {

    if (!obj || typeof obj !== 'object') {
      return;
    }

    for (const key of Object.keys(obj)) {

      if (hidden.includes(key)) {
        obj[key] = '********';
      } else {
        walk(obj[key]);
      }

    }

  };

  walk(clone);

  return clone;
}

function resolveAuditAction(
  method: string,
  route: string
): string {

  const r=route.toLowerCase();

  if(r.includes("/auth/login"))
    return "LOGIN";

  if(r.includes("/auth/register"))
    return "REGISTER";

  if(r.includes("/poles"))
    return method==="POST"
      ? "CREATE_POLE"
      : method==="PATCH"
      ? "UPDATE_POLE"
      : method==="DELETE"
      ? "DELETE_POLE"
      : "LIST_POLES";

  if(r.includes("/project-folders"))
    return method==="POST"
      ? "CREATE_FOLDER"
      : method==="PATCH"
      ? "UPDATE_FOLDER"
      : method==="DELETE"
      ? "DELETE_FOLDER"
      : "LIST_FOLDERS";

  if(r.includes("/company-files"))
    return method==="DELETE"
      ? "DELETE_DOCUMENT"
      : "LIST_DOCUMENTS";

  if(r.includes("/upload"))
    return "UPLOAD_FILE";

  if(r.includes("/users"))
    return method==="POST"
      ? "CREATE_USER"
      : method==="PATCH"
      ? "UPDATE_USER"
      : method==="DELETE"
      ? "DELETE_USER"
      : "LIST_USERS";

  return method;
}

function resolveAuditResult(
  statusCode:number
):string{

  if(statusCode>=200 && statusCode<300)
    return "SUCCESS";

  if(statusCode>=400 && statusCode<500)
    return "CLIENT_ERROR";

  if(statusCode>=500)
    return "SERVER_ERROR";

  return "UNKNOWN";
}






@Injectable()
export class AuditInterceptor
implements NestInterceptor {

  constructor(
    private readonly auditService: AuditService
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<any> {

    const req =
      context.switchToHttp().getRequest();

    const method =
      req.method;

    const route =
      req.originalUrl || req.url;

    const res =
      context.switchToHttp().getResponse();

    const user =
      req.user;

    const startedAt =
      Date.now();

    return next.handle().pipe(

      tap(async () => {

        try {

          if (!user?.companyId) {
            return;
          }

          await this.auditService.log({

            companyId:
              user.companyId,

            actorUserId:
              user.id || null,

            action:
              resolveAuditAction(
                method,
                route
              ) +
              "_" +
              resolveAuditResult(
                res.statusCode
              ),

            entity:
              route,

            metadata: {

              body:
                sanitizeAuditData(req.body),

              params:
                req.params,

              query:
                req.query,

              statusCode:
                res.statusCode,

              durationMs:
                Date.now()-startedAt,

              ip:
                req.ip,

              userAgent:
                req.headers['user-agent'],

              headers:{
                authorization:
                  req.headers?.authorization
                    ? '********'
                    : undefined
              }

            }

          });

        } catch (e) {

          console.error(
            'AUDIT_ERROR',
            e
          );

        }

      })

    );
  }
}
