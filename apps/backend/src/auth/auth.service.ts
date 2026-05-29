import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const verificationToken = uuidv4();

    const user = await this.usersService.create({
      email: dto.email,
      name: dto.name,
      password: dto.password,
      provider: 'local',
      emailVerified: false,
      verificationToken,
    });

    await this.mailService.sendVerificationEmail(user.email, user.name, verificationToken);

    return { message: 'Registration successful. Please check your email to verify your account.' };
  }

  async verifyEmail(token: string) {
    const user = await this.usersService.findByVerificationToken(token);
    if (!user) throw new BadRequestException('Invalid or expired verification token');

    await this.usersService.verifyEmail(user.id);
    return { message: 'Email verified successfully. You can now log in.' };
  }

  async validateLocalUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email, true);
    if (!user || user.provider !== 'local') return null;
    if (!user.emailVerified) throw new ForbiddenException('Please verify your email before logging in');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    const { password: _p, ...result } = user as any;
    return result;
  }

  async login(user: User) {
    return this.generateTokens(user);
  }

  async validateGoogleUser(profile: {
    googleId: string;
    email: string;
    name: string;
    avatar?: string;
  }): Promise<User> {
    let user = await this.usersService.findByGoogleId(profile.googleId);

    if (!user) {
      user = await this.usersService.findByEmail(profile.email);
    }

    if (!user) {
      user = await this.usersService.create({
        ...profile,
        provider: 'google',
        emailVerified: true,
      });
    } else if (!user.googleId) {
      await this.usersService.updateProfile(user.id, { name: user.name });
    }

    return user;
  }

  async googleLogin(user: User) {
    return this.generateTokens(user);
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findWithRefreshToken(userId);
    if (!user || !user.refreshToken) throw new UnauthorizedException();

    const matches = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!matches) throw new UnauthorizedException();

    return this.generateTokens(user);
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
    return { message: 'Logged out successfully' };
  }

  private async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.get('jwt.secret'),
      expiresIn: this.config.get('jwt.expiresIn'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get('jwt.refreshSecret'),
      expiresIn: this.config.get('jwt.refreshExpiresIn'),
    });

    const hashedRefresh = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateRefreshToken(user.id, hashedRefresh);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        provider: user.provider,
        emailVerified: user.emailVerified,
      },
    };
  }
}
