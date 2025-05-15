import { Activity } from 'src/modules/activities/entities/activity.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('machines')
export class Machine {
  @PrimaryGeneratedColumn()
  machineId: number;

  @Column({ unique: true })
  machineCode: string;

  @Column()
  orderNumber: string;

 
  @ManyToOne(() => Activity)
  @JoinColumn({ name: 'activityId' })
  activity: Activity;
 
}
