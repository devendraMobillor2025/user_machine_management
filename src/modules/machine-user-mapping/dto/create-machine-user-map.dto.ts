import { IsNotEmpty,  } from 'class-validator';
export class CreateMachineUserMapDto {
    @IsNotEmpty()
    userId: number;

    @IsNotEmpty()
    machineId: number;
  }
