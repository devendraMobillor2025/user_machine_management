import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class CreateReportDto {
    @IsNotEmpty()
    userId: number;

    @IsNotEmpty()
    machineId: number;

    @IsNotEmpty()
    timeSpent: number;

    @IsNotEmpty()
    date: string; // 'YYYY-MM-DD'
  }
