import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MachineAndUserMap } from './entities/machine-user-map.entity';
import { CreateMachineUserMapDto } from './dto/create-machine-user-map.dto';
import { UpdateMachineUserMapDto } from './dto/update-machine-user-map.dto';
import { User } from '../users/entities/user.entity';
import { Machine } from '../machines/entities/machine.entity';
import { log } from 'console';

@Injectable()
export class MachineUserMappingService {
  constructor(
    @InjectRepository(MachineAndUserMap)
    private machineUserMapRepo: Repository<MachineAndUserMap>,
    @InjectRepository(User)
    private userRepo: Repository<User>,     // ✅ User repository

    @InjectRepository(Machine)
    private machineRepo: Repository<Machine>
  ) {}

async create(dto: CreateMachineUserMapDto) {
  try {
    // Check if user exists
    const userExists = await this.userRepo.findOneBy({ userId: dto.userId });
    if (!userExists) {
      throw new NotFoundException(`User with id ${dto.userId} not found`);
    }

    // Check if machine exists
    const machineExists = await this.machineRepo.findOneBy({ machineId: dto.machineId });
    if (!machineExists) {
      return {status:false,statusCode:404,message:(`Machine with id ${dto.machineId} not found`)}
    }

    // Check if mapping already exists
    const existingMap = await this.machineUserMapRepo.findOneBy({ machineId: dto.machineId, userId: dto.userId });
    if (existingMap) {
        return {status:false,statusCode:409,message:'Machine and User mapping already exists'};
    }

    // Create and save new mapping
    const machineUserMap = this.machineUserMapRepo.create(dto);
    const savedMap = await this.machineUserMapRepo.save(machineUserMap);

    return {status:false, statusCode: 201, message: 'Machine and User mapping created successfully', data: savedMap };
  } catch (error) {
    if (error instanceof NotFoundException || error instanceof ConflictException) {
      throw error;
    }
    throw new InternalServerErrorException('Something went wrong while creating machine and user mapping');
  }
}

 async findAll() {
  try {
    const mappings = await this.machineUserMapRepo.find({
      relations: ['user', 'machine'], // Load user and machine data
    });

    if (!mappings || mappings.length === 0) {
      return {status:false, statusCode: 404, message: 'No mappings found', data: [] };
    }

    // Structure data into one object per mapping
    const data = mappings.map((map) => ({
      mappingId: map.machineAndUserMapId, 
      userId: map.user?.userId,
      userName: map.user?.userName,
      fullName: map.user?.name,
      email: map.user?.email,
      employeeId: map.user?.employeeId,

      machineId: map.machine?.machineId,
      machineCode: map.machine?.machineCode,
      orderNumber: map.machine?.orderNumber,
    }));

    return {status:true, statusCode: 200, message: 'Mappings retrieved successfully', data };
  } catch (error) {
    throw new InternalServerErrorException('Something went wrong while retrieving mappings');
  }
}


async findOne(id: number): Promise<{status:boolean, statusCode: number; message: string; data?: any }> {
  try {
    const mapping = await this.machineUserMapRepo.findOne({
      where: { machineAndUserMapId: id },
      relations: ['user', 'machine'],
    });

    if (!mapping) {
      return {status:false, statusCode: 404, message: 'Mapping not found' };
    }

    const data = {
      machineAndUserMapId: mapping.machineAndUserMapId,
      userId: mapping.user?.userId,
      userName: mapping.user?.userName,
      fullName: mapping.user?.name,
      email: mapping.user?.email,
      employeeId: mapping.user?.employeeId,
      machineId: mapping.machine?.machineId,
      machineCode: mapping.machine?.machineCode,
      orderNumber: mapping.machine?.orderNumber,
      createdAt: mapping['createdAt'] || null,
    };

    return {
      status:true,
      statusCode: 200,
      message: 'Mapping retrieved successfully',
      data,
    };
  } catch (error) {
    throw new InternalServerErrorException('Something went wrong while retrieving mapping');
  }
}


async findByMachineId(machineId: number) {
  try {
    const mappings = await this.machineUserMapRepo.find({
      where: { machineId },
      relations: ['user', 'machine'],
    });

    if (!mappings || mappings.length === 0) {
      return {status:false, statusCode: 404, message: 'No mappings found for this machine', data: [] };
    }

    const data = mappings.map((map) => ({
      mappingId: map.machineAndUserMapId,
      userId: map.user?.userId,
      userName: map.user?.userName,
      fullName: map.user?.name,
      email: map.user?.email,
      employeeId: map.user?.employeeId,

      machineId: map.machine?.machineId,
      machineCode: map.machine?.machineCode,
      orderNumber: map.machine?.orderNumber,
    }));

    return {status:true, statusCode: 200, message: 'Mappings retrieved successfully', data };
  } catch (error) {
    throw new InternalServerErrorException('Something went wrong while retrieving mappings');
  }
}
async findByUserId(userId: number) {
  try {
    const mappings = await this.machineUserMapRepo.find({
      where: { userId },
      relations: ['user', 'machine'],
    });

    if (!mappings || mappings.length === 0) {
      return {status:false, statusCode: 404, message: 'No mappings found for this user', data: [] };
    }

    const data = mappings.map((map) => ({
      mappingId: map.machineAndUserMapId,
      userId: map.user?.userId,
      userName: map.user?.userName,
      fullName: map.user?.name,
      email: map.user?.email,
      employeeId: map.user?.employeeId,

      machineId: map.machine?.machineId,
      machineCode: map.machine?.machineCode,
      orderNumber: map.machine?.orderNumber,
    }));

    return {status:true, statusCode: 200, message: 'Mappings retrieved successfully', data };
  } catch (error) {
    throw new InternalServerErrorException('Something went wrong while retrieving mappings');
  }
}


async update(id: number, dto: UpdateMachineUserMapDto) {
  try {
    // Check if user exists
    const user = await this.userRepo.findOneBy({ userId: dto.userId });
    if (!user) {
      return {status:false, statusCode: 404, message: `User with id ${dto.userId} not found` };
    }

    // Check if machine exists
    const machine = await this.machineRepo.findOneBy({ machineId: dto.machineId });
    if (!machine) {
      return {status:false, statusCode: 404, message: `Machine with id ${dto.machineId} not found` };
    }

    // Check if mapping exists
    const existingMap = await this.machineUserMapRepo.findOneBy({ machineAndUserMapId: id });
    if (!existingMap) {
      return { statusCode: 404, message: 'Mapping not found' };
    }

    // Update the mapping
    const updateResult = await this.machineUserMapRepo.update(id, dto);
    if (updateResult.affected === 0) {
      return {status:false, statusCode: 500, message: 'Mapping update failed' };
    }

    const updated = await this.machineUserMapRepo.findOne({
  where: { machineAndUserMapId: id },
  relations: ['user', 'machine'],
});

if (!updated) {
  return {status:false, statusCode: 404, message: 'Mapping not found after update' };
}

// now safe to access updated properties
const result = {
  machineAndUserMapId: updated.machineAndUserMapId,
  userId: updated.user.userId,
  userName: updated.user.userName,
  userEmail: updated.user.email,
  userEmployeeId: updated.user.employeeId,
  machineId: updated.machine.machineId,
  machineCode: updated.machine.machineCode,
  orderNumber: updated.machine.orderNumber,
};


    return {
      status:true,
      statusCode: 200,
      message: 'Mapping updated successfully',
      data: result,
    };
  } catch (error) {
    throw new InternalServerErrorException('Something went wrong while updating mapping');
  }
}




 async remove(id: number) {
  try {
    const mappingResponse = await this.findOne(id);
    if (mappingResponse.statusCode === 404) {
      return {status:false, statusCode: 404, message: 'Mapping not found' };
    }
    await this.machineUserMapRepo.delete(id);
    return {status:true, statusCode: 200, message: 'Mapping removed successfully' };
  } catch (error) {
    console.log('Error removing mapping:', error);
    throw new InternalServerErrorException('Something went wrong while removing mapping');
  }
}

}
