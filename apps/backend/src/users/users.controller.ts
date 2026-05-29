import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }

  @Put('me')
  updateProfile(@Request() req, @Body() body: { name?: string; avatar?: string }) {
    return this.usersService.updateProfile(req.user.id, body);
  }
}
