import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProjectsModule } from "./modules/projects/projects.module";
import { StationsModule } from "./modules/stations/stations.module";
import { RacksModule } from "./modules/racks/racks.module";
import { RackEquipmentsModule } from "./modules/rack-equipments/rack-equipments.module";
import { FiberSignalsModule } from "./modules/fiber-signals/fiber-signals.module";

import { PrismaModule } from './modules/prisma/prisma.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { AuthModule } from './modules/auth/auth.module';
import { TechniciansModule } from './modules/technicians/technicians.module';
import { HealthController } from './health.controller';


import { RootModule } from "./modules/root/root.module";
@Module({
  imports: [

    
    
    
    RootModule,
FiberSignalsModule,
ProjectsModule,
    StationsModule,
    RacksModule,
    RackEquipmentsModule,
ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    PrismaModule,
    CompaniesModule,
    AuthModule,
    TechniciansModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
