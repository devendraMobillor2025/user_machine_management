import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private activityRepo: Repository<Activity>,
  ) {}

  async create(dto: CreateActivityDto) {
    try {
      const existingActivity = await this.activityRepo.findOneBy({ activityName: dto.activityName });
      if (existingActivity) {
        return { statusCode: 409, message: 'Activity already exists' };
      }
      const activity = this.activityRepo.create(dto);

     const savedActivity = await this.activityRepo.save(activity);
     return { statusCode: 201, message: 'Activity created successfully', data: savedActivity };
    } catch (error) {
      throw new InternalServerErrorException('something went wrong while creating activity');
    }
  }

  async findAll() {
    try {
      const activities = await this.activityRepo.find();
      return { statusCode: 200, message: 'Activities retrieved successfully', data: activities };
    } catch (error) {
      throw new InternalServerErrorException('something went wrong while retrieving activities');
    }
  }

  async findOne(id: number) {
    try {
      const activity = await this.activityRepo.findOneBy({ activityId: id });
      if (!activity) {
        return { statusCode: 404, message: 'Activity not found' };
      }
      return { statusCode: 200, message: 'Activity retrieved successfully', data: activity };
    } catch (error) {
      throw new InternalServerErrorException('something went wrong while retrieving activity');
    }
  }

  async update(id: number, dto: UpdateActivityDto) {
    try {
      await this.activityRepo.update(id, dto);
    const updatedActivity = await this.findOne(id);
    return { statusCode: 200, message: 'Activity updated successfully', data: updatedActivity };
    } catch (error) {
      throw new InternalServerErrorException('something went wrong while updating activity');
    }
    
  }

  async remove(id: number) {
    try {
      const activity = await this.activityRepo.findOneBy({ activityId: id });
      if (!activity) {
        return { statusCode: 404, message: 'Activity not found' };
      }
      await this.activityRepo.delete(id);
      return { statusCode: 200, message: 'Activity removed successfully' };
    } catch (error) {
      throw new InternalServerErrorException('something went wrong while removing activity');
    }
  }
}
