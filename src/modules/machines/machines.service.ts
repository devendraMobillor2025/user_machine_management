import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Machine } from './entities/machine.entity';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';

@Injectable()
export class MachinesService {
  constructor(
    @InjectRepository(Machine)
    private machineRepo: Repository<Machine>,
  ) {}

 async create(dto: CreateMachineDto) {
   try {
     const existingMachine = await this.machineRepo.findOneBy({ machineCode: dto.machineCode });
    if (existingMachine) {
     return {status:false, statusCode: 409, message: 'Machine already exists', data: [] };;
    }
    const machine = this.machineRepo.create(dto);
    const savedMachine = await this.machineRepo.save(machine);
    return {status:true, statusCode: 201, message: 'Machine created successfully', data: savedMachine };
   } catch (error) {
     throw new InternalServerErrorException('something went wrong while creating machine');
   }
  }

 async findAll() {
    try {
      const machines= await this.machineRepo.find();
      if (!machines) {
        return {status:false, statusCode: 404, message: 'No machines found', data: [] };
      }
      return {status:true, statusCode: 200, message: 'Machines retrieved successfully', data: machines };
    } catch (error) {
      throw new InternalServerErrorException('something went wrong while retrieving machines');
    }
  }

  async findOne(id: number) {
    try {
      const machine = await this.machineRepo.findOneBy({ machineId: id });
      if (!machine) {
        return {status:false, statusCode: 404, message: 'Machine not found' };
      }
      return {status:true, statusCode: 200, message: 'Machine retrieved successfully', data: machine };
    } catch (error) {
      throw new InternalServerErrorException('something went wrong while retrieving machine');
    }
  }

 async update( dto: UpdateMachineDto) {
  const{machineId,...rest}=dto
  const updatePayload={...rest}
  if (!machineId) {
      return { status: false, statusCode: 400, message: 'machineId is required in body' };
    }
  try {
    const result = await this.machineRepo.update(machineId, updatePayload);

    if (result.affected === 0) {
      throw new NotFoundException('Machine not found or no changes detected');
    }

    const machine = await this.findOne(machineId);

    return {
      status:true,
      statusCode: 200,
      message: 'Machine updated successfully',
      data: machine,
    };
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    console.error('Error updating machine:', error);
    throw new InternalServerErrorException('Something went wrong while updating machine');
  }
}

  async remove(id: number) {
    try {
      const machine = await this.machineRepo.findOneBy({ machineId: id });
      if (!machine) {
        return {status:false, statusCode: 404, message: 'Machine not found' };
      }
      await this.machineRepo.delete(id);
      return {status:true, statusCode: 200, message: 'Machine removed successfully' };
    } catch (error) {
      throw new InternalServerErrorException('something went wrong while removing machine');
    }
  }
}
