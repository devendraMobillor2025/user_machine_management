import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MachineUserMappingService } from './machine-user-mapping.service';
import { MachineUserMappingController } from './machine-user-mapping.controller';
import { MachineAndUserMap } from './entities/machine-user-map.entity';
import { UsersModule } from '../users/users.module';
import { MachinesModule } from '../machines/machines.module';

@Module({
  imports: [TypeOrmModule.forFeature([MachineAndUserMap]), UsersModule, MachinesModule],
  controllers: [MachineUserMappingController],
  providers: [MachineUserMappingService],
})
export class MachineUserMappingModule {}
