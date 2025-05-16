import { Controller, Get, Post, Body, Param, Put, Delete, Query, BadRequestException } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  create(@Body() dto: CreateReportDto) {
    return this.reportService.create(dto);
  }

  @Get()
  findAll() {
    return this.reportService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
     if (!id || isNaN(+id)) {
        throw new BadRequestException('Valid numeric id is required');
      }
    return this.reportService.findOne(+id);
  }

  @Put()
  update( @Body() dto: UpdateReportDto) {
    return this.reportService.update( dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
     if (!id || isNaN(+id)) {
    throw new BadRequestException('Valid numeric id is required');
  }
    return this.reportService.remove(+id);
  }

  @Get('/filter/data')
  getByUserMachineActivity(
    @Query('userId') userId: string,
    @Query('machineId') machineId: string,
    @Query('date') date?: string,
  ) {
    return this.reportService.findByUserMachineActivity(+userId, +machineId, date);
  }
}
