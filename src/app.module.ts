import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { MachinesModule } from './modules/machines/machines.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { MachineUserMappingModule } from './modules/machine-user-mapping/machine-user-mapping.module';
import { ReportModule } from './modules/report/report.module';

@Module({
  imports: [ TypeOrmModule.forRoot(typeOrmConfig),UsersModule, MachinesModule, ActivitiesModule, MachineUserMappingModule, ReportModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
