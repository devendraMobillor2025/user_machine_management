import {IsNotEmpty, IsString,  } from 'class-validator';
export class CreateActivityDto {
    @IsString()
    @IsNotEmpty()
    activityName: string;

    @IsNotEmpty()
    requiredTime: number;
  }
