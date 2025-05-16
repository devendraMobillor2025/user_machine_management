import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ReportOfTimeSpent } from './entities/report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { User } from '../users/entities/user.entity';
import { Machine } from '../machines/entities/machine.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(ReportOfTimeSpent)
    private reportRepo: Repository<ReportOfTimeSpent>,
     @InjectRepository(User)
    private userRepo: Repository<User>,     // ✅ User repository

    @InjectRepository(Machine)
    private machineRepo: Repository<Machine> 
  ) {}

 async create(dto: CreateReportDto) {
  try {
    // Check if the user exists
    const user = await this.userRepo.findOneBy({ userId: dto.userId });
    if (!user) {
      return {status:false, statusCode: 404, message: 'User not found' };
    }

    // Check if the machine exists
    const machine = await this.machineRepo.findOneBy({ machineId: dto.machineId });
    if (!machine) {
      return {status:false, statusCode: 404, message: 'Machine not found' };
    }

    // Create and save the report
    const report = this.reportRepo.create(dto);
    await this.reportRepo.save(report);

    return {
      status:true,
      statusCode: 201,
      message: 'Report created successfully',
      data: report,
    };
  } catch (error) {
    console.error('Error creating report:', error);
    throw new InternalServerErrorException('Something went wrong while creating report');
  }
}


 async findAll() {
  try {
const reports = await this.reportRepo.manager.query(`
  SELECT 
    r.reportOfTimeSpentId,
    r.timeSpent,
    r.date,
    u.userName,
    u.name AS userNameFull,
    u.email AS userEmail,
    u.employeeId,
    m.machineCode,
    m.orderNumber,
    a.activityName
  FROM report_of_time_spent r
  LEFT JOIN [user] u ON u.userId = r.userId
  LEFT JOIN dbo.machines m ON m.machineId = r.machineId
  LEFT JOIN dbo.activities a ON a.activityId = m.activityId
  ORDER BY r.date ASC
`);


    if (!reports || reports.length === 0) {
      return {
        status:false,
        statusCode: HttpStatus.NOT_FOUND,
        success: false,
        message: 'No reports found',
        data: [],
      };
    }

    return {
      status:true,
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Reports retrieved successfully',
      data: reports,
    };
  } catch (error) {
    console.error('Report retrieval error:', error);
    throw new HttpException({
      success: false,
      message: 'Error retrieving reports',
      error: error.message || error,
    }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

 async findOne(id: number): Promise<{status:boolean, statusCode: number; message: string; data?: any }> {
  try {
    const report = await this.reportRepo.findOne({
      where: { reportOfTimeSpentId: id },
      relations: ['user', 'machine'],
    });

    if (!report) {
      return {status:false, statusCode: 404, message: 'Report not found' };
    }

    // Structure the response
    const data = {
      reportId: report.reportOfTimeSpentId,
      timeSpent: report.timeSpent,
      date: report.date,

      
        userId: report.user?.userId,
        userName: report.user?.userName,
        fullName: report.user?.name,
        email: report.user?.email,
        employeeId: report.user?.employeeId,
    

     
        machineId: report.machine?.machineId,
        machineCode: report.machine?.machineCode,
        orderNumber: report.machine?.orderNumber,
      
    };

    return {status:true, statusCode: 200, message: 'Report retrieved successfully', data };
  } catch (error) {
    throw new InternalServerErrorException('Something went wrong while retrieving report');
  }
}


async update(id: number, dto: UpdateReportDto): Promise<{status:boolean, statusCode: number; message: string; data?: any }> {
  try {
    const report = await this.reportRepo.findOne({ where: { reportOfTimeSpentId: id } });
    if (!report) {
      return {status:false, statusCode: 404, message: 'Report not found' };
    }

    if (dto.userId) {
      const user = await this.userRepo.findOne({ where: { userId: dto.userId } });
      if (!user) {
        return {status:false, statusCode: 404, message: 'User not found' };
      }
      report.user = user;
    }

    if (dto.machineId) {
      const machine = await this.machineRepo.findOne({ where: { machineId: dto.machineId } });
      if (!machine) {
        return {status:false, statusCode: 404, message: 'Machine not found' };
      }
      report.machine = machine;
    }

    // Update other fields (e.g., timeSpent, date)
    this.reportRepo.merge(report, dto);
    await this.reportRepo.save(report);

    // Return structured response like `findOne`
    const data = {
      reportId: report.reportOfTimeSpentId,
      timeSpent: report.timeSpent,
      date: report.date,
      userId: report.user?.userId,
      userName: report.user?.userName,
      fullName: report.user?.name,
      email: report.user?.email,
      employeeId: report.user?.employeeId,
      machineId: report.machine?.machineId,
      machineCode: report.machine?.machineCode,
      orderNumber: report.machine?.orderNumber,
    };

    return {status:true, statusCode: 200, message: 'Report updated successfully', data };
  } catch (error) {
    throw new InternalServerErrorException('Something went wrong while updating the report');
  }
}


async remove(id: number): Promise<{status:boolean, statusCode: number; message: string }> {
  try {
    const report = await this.reportRepo.findOne({ where: { reportOfTimeSpentId: id } });
    if (!report) {
      return {status:false, statusCode: 404, message: 'Report not found' };
    }

    await this.reportRepo.delete(id);
    return {status:true, statusCode: 200, message: 'Report removed successfully' };
  } catch (error) {
    throw new InternalServerErrorException('Something went wrong while removing the report');
  }
}


async findByUserMachineActivity(
  userId?: number, 
  machineId?: number, 
  date?: string
): Promise<{status:boolean, statusCode: number; message: string; data?: any }> {
  try {
    const where: any = {};
    if (userId !== undefined) where.userId = userId;
    if (machineId !== undefined) where.machineId = machineId;
    if (date !== undefined) where.date = date;

    const report = await this.reportRepo.findOne({ where, relations: ['user', 'machine'] });

    if (!report) {
      return {status:false, statusCode: 404, message: 'No report found matching criteria' };
    }

    // Optionally structure the data as you want
    const data = {
      reportId: report.reportOfTimeSpentId,
      timeSpent: report.timeSpent,
      date: report.date,

      
        userId: report.user?.userId,
        userName: report.user?.userName,
        fullName: report.user?.name,
        email: report.user?.email,
        employeeId: report.user?.employeeId,
     

     
        machineId: report.machine?.machineId,
        machineCode: report.machine?.machineCode,
        orderNumber: report.machine?.orderNumber,
      
    };

    return {status:true, statusCode: 200, message: 'Report retrieved successfully', data };
  } catch (error) {
    throw new InternalServerErrorException('Something went wrong while retrieving reports');
  }
}

}
