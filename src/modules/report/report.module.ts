import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { ReportOfTimeSpent } from './entities/report.entity';
import { MachinesModule } from '../machines/machines.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([ReportOfTimeSpent]),MachinesModule  ,UsersModule],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
