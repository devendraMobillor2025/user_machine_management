import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class CreateMachineDto {
    @IsNotEmpty()
    machineCode: string;

    @IsNotEmpty()
    orderNumber: string;

    @IsNotEmpty()
    activityId: number;
  }
