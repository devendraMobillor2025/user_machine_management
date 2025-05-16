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

    @Column({ type: 'varchar', nullable: true }) // or just @Column({ nullable: true })
  otpHash: string|null;

  @Column({ type: 'datetime2', nullable: true })
  otpExpiresAt: Date|null;

  @Column({ default: false })
  isOtpVerified: boolean;
}
