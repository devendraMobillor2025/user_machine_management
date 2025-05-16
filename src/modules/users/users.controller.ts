import { Controller, Get, Post, Body, Param, Put, Delete, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
     if (!id || isNaN(+id)) {
        throw new BadRequestException('Valid numeric id is required');
      }
    return this.usersService.findOne(+id);
  }

  @Put()
  update( @Body() dto: UpdateUserDto) {
    return this.usersService.update(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
     if (!id || isNaN(+id)) {
    throw new BadRequestException('Valid numeric id is required');
  }
    return this.usersService.remove(+id);
  }
}
