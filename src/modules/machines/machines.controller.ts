import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { MachinesService } from './machines.service';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';

@Controller('machines')
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) {}

  @Post()
  create(@Body() dto: CreateMachineDto) {
    return this.machinesService.create(dto);
  }

  @Get()
  findAll() {
    return this.machinesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.machinesService.findOne(+id);
  }

  @Put()
  update(@Body() dto: UpdateMachineDto) {
    return this.machinesService.update(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.machinesService.remove(+id);
  }
}
