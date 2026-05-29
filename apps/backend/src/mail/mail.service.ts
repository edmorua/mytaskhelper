import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get('mail.host'),
      port: this.config.get<number>('mail.port'),
      secure: false,
      auth: {
        user: this.config.get('mail.user'),
        pass: this.config.get('mail.pass'),
      },
    });
  }

  async sendVerificationEmail(to: string, name: string, token: string) {
    const frontendUrl = this.config.get('frontendUrl');
    const verifyUrl = `${frontendUrl}/verify-email?token=${token}`;

    await this.transporter.sendMail({
      from: this.config.get('mail.from'),
      to,
      subject: 'Verify your MyTaskHelper account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1565C0; padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">MyTaskHelper</h1>
          </div>
          <div style="padding: 32px; background: #ffffff;">
            <h2 style="color: #1a1a2e;">Welcome, ${name}!</h2>
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
              Thanks for signing up. Please verify your email address to get started.
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${verifyUrl}"
                style="background: #1565C0; color: white; padding: 14px 32px; text-decoration: none;
                       border-radius: 6px; font-size: 16px; font-weight: 600; display: inline-block;">
                Verify Email Address
              </a>
            </div>
            <p style="color: #999; font-size: 14px;">
              Or copy this link: <a href="${verifyUrl}" style="color: #1565C0;">${verifyUrl}</a>
            </p>
            <p style="color: #999; font-size: 14px;">This link expires in 24 hours.</p>
          </div>
          <div style="background: #f5f5f5; padding: 16px; text-align: center;">
            <p style="color: #999; font-size: 13px; margin: 0;">
              © 2025 MyTaskHelper. All rights reserved.
            </p>
          </div>
        </div>
      `,
    });

    this.logger.log(`Verification email sent to ${to}`);
  }
}
