import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // Send OTP to email
  async sendOtp(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user){
        return{ status :false ,statusCode:404,message:"User not found with this email"}
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const otpHash = await bcrypt.hash(otp, 10);
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    user.otpHash = otpHash;
    user.otpExpiresAt = expiry;
    user.isOtpVerified = false;

    await this.userRepo.save(user);

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user:process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // consider using env variables
      },
    });

   await transporter.sendMail({
  from: '"Support - User Machine Management" <your_email@gmail.com>',
  to: user.email,
  subject: 'Reset Your Password - OTP Inside',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background-color: #f9f9f9; border: 1px solid #e0e0e0;">
      <h2 style="color: #333;">🔐 Password Reset Request</h2>
      <p>Hello <strong>${user.name || 'User'}</strong>,</p>
      <p>We received a request to reset your password for your account on <strong>User Machine Management</strong>.</p>
      <p style="margin-top: 20px; font-size: 18px;">
        👉 <strong>Your One-Time Password (OTP):</strong>
      </p>
      <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #2c3e50; margin: 10px 0;">
        ${otp}
      </div>
      <p>This OTP is valid for the next <strong>10 minutes</strong>. Please do not share it with anyone.</p>
      <p>If you did not request this password reset, you can safely ignore this email.</p>
      <hr style="margin: 30px 0;">
      <p style="font-size: 12px; color: #999;">
        Need help? Contact us at support@yourdomain.com<br>
        © ${new Date().getFullYear()} User Machine Management. All rights reserved.
      </p>
    </div>
  `,
});

    return { status: true,statusCode:200, message: 'OTP sent to email' };
  }

  // Verify OTP
  async verifyOtp(email: string, otp: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user || !user.otpHash || !user.otpExpiresAt) {
    return{status:false,statusCode: 400,message:'OTP not generated for this user! please generate otp first '}
    }

    if (user.otpExpiresAt < new Date()) {
    return{status:false,statusCode: 400,message:'OTP expired '}   }

    const isMatch = await bcrypt.compare(otp, user.otpHash);
    if (!isMatch) return{status:false,statusCode: 400,message:'OTP expired '}   


    user.isOtpVerified = true;
    await this.userRepo.save(user);

    return { status: true, statusCode :200, message: 'OTP verified successfully' };
  }

  // Update password
  async updatePassword(email: string, newPassword: string) {
    const user = await this.userRepo.findOne({ where: { email } });

if (!newPassword)return{status :false,statusCode:400,message:"Password is required"}

    if (!user || !user.isOtpVerified) {
     return{status :false,statusCode:400,message:"OTP verification required before password reset"}
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otpHash = null;
    user.otpExpiresAt = null;
    user.isOtpVerified = false;

    await this.userRepo.save(user);

    return { status: true, message: 'Password updated successfully' };
  }
}
