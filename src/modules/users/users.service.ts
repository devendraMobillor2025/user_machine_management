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

  async create(createUserDto: CreateUserDto): Promise<{statusCode:number;message:string;data?: User}> {
  try {
    const existingUser = await this.userRepo.findOneBy({ email: createUserDto.email ,userName:createUserDto.userName});
    if (existingUser) {
      return { statusCode: 409, message: 'Email or username already exists' };
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = this.userRepo.create({ ...createUserDto, password: hashedPassword });
    const savedUser = await this.userRepo.save(newUser);
    return { statusCode: 201, message: 'User created successfully', data: savedUser };
  } catch (error) {
    if(error instanceof ConflictException){
       throw error;
    }
    throw new InternalServerErrorException('somthing went wrong while creating user')
  }
  }

  async findAll(): Promise<{statusCode:number ; message :string;data: User[]}> {
    try {
      const users = await this.userRepo.find();
      if (!users) {
        return { statusCode: 404, message: 'No users found', data: [] };
      }
      return { statusCode: 200, message: 'Users retrieved successfully', data: users };
    } catch (error) {
      if(error instanceof ConflictException){
       throw error;
    }
      throw new InternalServerErrorException('something went wrong while retrieving users');
    }
  }

async findOne(id: number): Promise<{ statusCode: number; message: string; data?: User | null }> {
  try {
    const user = await this.userRepo.findOneBy({ userId: id });

    if (!user) {
      return {
        statusCode: 404,
        message: 'User not found',
        data: null,
      };
    }

    return {
      statusCode: 200,
      message: 'User retrieved successfully',
      data: user,
    };
  } catch (error) {
    console.error('Error in findOne:', error);
    throw new InternalServerErrorException('Something went wrong while retrieving user');
  }
}


  async update(id: number, updateUserDto: UpdateUserDto): Promise<{statusCode:number;message:string ;data?:User | null}> {
   try {
     if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    await this.userRepo.update(id, updateUserDto);
    const updatedUser = await this.findOne(id);
    if (!updatedUser) {
      return { statusCode: 404, message: 'User not found' };
    }
    return { statusCode: 200, message: 'User updated successfully', data: updatedUser.data };

   } catch (error) {
    if(error instanceof ConflictException){
       throw error;
    }
     throw new InternalServerErrorException('something went wrong while updating user');
   }
  }

  
async remove(id: number): Promise<{ statusCode: number; message: string }> {
  try {
    const user = await this.userRepo.findOneBy({ userId: id });

    if (!user) {
      return { statusCode: 404, message: 'User not found' };
    }

    await this.userRepo.delete(id);

    return { statusCode: 200, message: 'User removed successfully' };
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
