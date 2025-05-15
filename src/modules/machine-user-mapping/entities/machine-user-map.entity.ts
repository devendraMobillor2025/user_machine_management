import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Machine } from '../../machines/entities/machine.entity';

@Entity('machine_user_mapping')
export class MachineAndUserMap {
  @PrimaryGeneratedColumn()
  machineAndUserMapId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Machine)
  @JoinColumn({ name: 'machineId' })
  machine: Machine;

  @Column()
  userId: number;

  @Column()
  machineId: number;
}
