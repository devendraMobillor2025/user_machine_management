import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MachinesService } from './machines.service';
import { MachinesController } from './machines.controller';
import { Machine } from './entities/machine.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Machine])],
  controllers: [MachinesController],
  providers: [MachinesService],
  exports: [TypeOrmModule]
})
export class MachinesModule {}
