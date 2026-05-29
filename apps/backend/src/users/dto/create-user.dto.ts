import { IsEmail, IsString, IsOptional, IsBoolean } from 'class-validator';
import { AuthProvider } from '../entities/user.entity';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  provider?: AuthProvider;

  @IsOptional()
  @IsString()
  googleId?: string;

  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;

  @IsOptional()
  @IsString()
  verificationToken?: string;
}
