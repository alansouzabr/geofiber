import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type JwtUserPayload = {
  userId: string;
  companyId: string;
  email?: string;
  name?: string;
  // campos comuns em JWT
  sub?: string;
  id?: string;
};

export const CurrentUser = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const u = (req.user ?? {}) as JwtUserPayload;

  // suporta sub/id caso o Auth use padrão JWT
  const userId = u.userId ?? u.sub ?? u.id;
  const companyId = u.companyId;

  return {
    ...u,
    userId: userId as string,
    companyId: companyId as string,
  } as JwtUserPayload;
});
