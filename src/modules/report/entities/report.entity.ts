import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Machine } from '../../machines/entities/machine.entity';

@Entity('report_of_time_spent')
export class ReportOfTimeSpent {
  @PrimaryGeneratedColumn()
  reportOfTimeSpentId: number;

  @Column()
  userId: number;

  @Column()
  machineId: number;

  @Column('float')
  timeSpent: number; // in hours (can be partial)

  @Column({ type: 'date' })
  date: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Machine)
  @JoinColumn({ name: 'machineId' })
  machine: Machine;
}
