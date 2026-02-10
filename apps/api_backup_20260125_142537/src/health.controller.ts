import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  ok() {
    return { status: 'OK', service: 'GeoFiber API' };
  }
}
