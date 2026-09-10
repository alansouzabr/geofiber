import { Injectable, NestMiddleware } from '@nestjs/common';
import { requestContext } from './request-context';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    requestContext.run({ user: req.user }, () => {
      next();
    });
  }
}
