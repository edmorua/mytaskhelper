import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private todosService: TodosService) {}

  @Get()
  findAll(@Request() req) {
    return this.todosService.findAllForUser(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.todosService.findById(id, req.user.id);
  }

  @Post()
  create(@Request() req, @Body() dto: CreateTodoDto) {
    return this.todosService.create(req.user.id, dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Request() req, @Body() dto: UpdateTodoDto) {
    return this.todosService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Request() req) {
    return this.todosService.remove(id, req.user.id);
  }
}
