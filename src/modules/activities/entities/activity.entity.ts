import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn()
  activityId: number;

  @Column()
  activityName: string;

  @Column('int')
  requiredTime: number; // Time in minutes
}
