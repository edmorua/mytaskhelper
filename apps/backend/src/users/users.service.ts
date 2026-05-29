import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.repo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const user = this.repo.create({
      ...dto,
      password: dto.password ? await bcrypt.hash(dto.password, 12) : null,
    });

    return this.repo.save(user);
  }

  async findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByEmail(email: string, withPassword = false): Promise<User | null> {
    const qb = this.repo.createQueryBuilder('user').where('user.email = :email', { email });
    if (withPassword) qb.addSelect('user.password');
    return qb.getOne();
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.repo.findOne({ where: { googleId } });
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    return this.repo
      .createQueryBuilder('user')
      .addSelect('user.verificationToken')
      .where('user.verificationToken = :token', { token })
      .getOne();
  }

  async verifyEmail(userId: string): Promise<void> {
    await this.repo.update(userId, {
      emailVerified: true,
      verificationToken: null,
    });
  }

  async updateRefreshToken(userId: string, token: string | null): Promise<void> {
    await this.repo.update(userId, { refreshToken: token });
  }

  async updateProfile(userId: string, data: Partial<Pick<User, 'name' | 'avatar'>>): Promise<User> {
    await this.repo.update(userId, data);
    return this.findById(userId);
  }

  async findWithRefreshToken(userId: string): Promise<User | null> {
    return this.repo
      .createQueryBuilder('user')
      .addSelect('user.refreshToken')
      .where('user.id = :id', { id: userId })
      .getOne();
  }
}
