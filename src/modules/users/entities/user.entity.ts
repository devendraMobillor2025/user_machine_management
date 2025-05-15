// users/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  userName: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  employeeId: string;

  @Column()
  password: string;
}
