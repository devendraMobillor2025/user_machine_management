import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<{status:boolean;statusCode:number;message:string;data?: User}> {
  try {
    const existingUser = await this.userRepo.findOneBy({ email: createUserDto.email ,userName:createUserDto.userName});
    if (existingUser) {
      return {status:false, statusCode: 409, message: 'Email or username already exists' };
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = this.userRepo.create({ ...createUserDto, password: hashedPassword });
    const savedUser = await this.userRepo.save(newUser);
    return {status:true, statusCode: 201, message: 'User created successfully', data: savedUser };
  } catch (error) {
    if(error instanceof ConflictException){
       throw error;
    }
    throw new InternalServerErrorException('somthing went wrong while creating user')
  }
  }

  async findAll(): Promise<{status:boolean ,statusCode:number ; message :string;data: User[]}> {
    try {
      const users = await this.userRepo.find();
      if (!users) {
        return { status:false,statusCode: 404, message: 'No users found', data: [] };
      }
      return {status:true, statusCode: 200, message: 'Users retrieved successfully', data: users };
    } catch (error) {
      if(error instanceof ConflictException){
       throw error;
    }
      throw new InternalServerErrorException('something went wrong while retrieving users');
    }
  }

async findOne(id: number): Promise<{status:boolean; statusCode: number; message: string; data?: User | null }> {
  try {
    const user = await this.userRepo.findOneBy({ userId: id });
    if (!id||id===undefined||null) {
      return {
        status:false,
        statusCode: 400,
        message: 'A valid user ID must be provided',
        data: null,
      };}

    if (!user) {
      return {
        status:false,
        statusCode: 404,
        message: 'User not found',
        data: null,
      };
    }

    return {
      status:true,
      statusCode: 200,
      message: 'User retrieved successfully',
      data: user,
    };
  } catch (error) {
    console.error('Error in findOne:', error);
    throw new InternalServerErrorException('Something went wrong while retrieving user');
  }
}


 async update(updateUserDto: UpdateUserDto): Promise<{
  status: boolean;
  statusCode: number;
  message: string;
  data?: User | null;
}> {
  try {
     const { userId, password, ...rest } = updateUserDto;

    // Do not update password even if provided
    // If you ever want to update password, use a separate endpoint
    const updatePayload = { ...rest };

    if (!userId) {
      return { status: false, statusCode: 400, message: 'UserId is required in body' };
    }
    await this.userRepo.update(userId, updatePayload);

    const updatedUser = await this.findOne(userId);
    if (!updatedUser) {
      return { status: false, statusCode: 404, message: 'User not found' };
    }

    return {
      status: true,
      statusCode: 200,
      message: 'User updated successfully',
      data: updatedUser.data,
    };
  } catch (error) {
    console.log(error)
    if (error instanceof ConflictException) {
      throw error;
    }
    throw new InternalServerErrorException('Something went wrong while updating user');
  }
}


  
async remove(id: number): Promise<{status:boolean, statusCode: number; message: string }> {
  try {
    const user = await this.userRepo.findOneBy({ userId: id });

    if (!user) {
      return {status:false, statusCode: 404, message: 'User not found' };
    }

    await this.userRepo.delete(id);

    return {status:true ,statusCode: 200, message: 'User removed successfully' };
  } catch (error) {
    if (
      error?.originalError?.info?.number === 547 ||  // SQL Server FK constraint violation
      error?.message?.includes('REFERENCE constraint')
    ) {
      throw new ConflictException(
        'Cannot delete this user because it is referenced in machine-user mappings.'
      );
    }

    console.error('Unexpected error:', error);
    throw new InternalServerErrorException('Something went wrong while removing the user');
  }
}



}
