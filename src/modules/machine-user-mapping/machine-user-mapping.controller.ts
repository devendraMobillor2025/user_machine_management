import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { MachineUserMappingService } from './machine-user-mapping.service';
import { CreateMachineUserMapDto } from './dto/create-machine-user-map.dto';
import { UpdateMachineUserMapDto } from './dto/update-machine-user-map.dto';

@Controller('machine-user-mapping')
export class MachineUserMappingController {
  constructor(private readonly machineUserMappingService: MachineUserMappingService) {}

  @Post()
  create(@Body() dto: CreateMachineUserMapDto) {
    return this.machineUserMappingService.create(dto);
  }

  @Get()
  findAll() {
    return this.machineUserMappingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.machineUserMappingService.findOne(+id);
  }
  @Get('machine/:id')
  findByMachineId(@Param('id') id: string) {
    return this.machineUserMappingService.findByMachineId(+id);
  }
  @Get('user/:id')
  findByUserId(@Param('id') id: string) {
    return this.machineUserMappingService.findByUserId(+id);
  }
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMachineUserMapDto) {
    return this.machineUserMappingService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.machineUserMappingService.remove(+id);
  }
}
