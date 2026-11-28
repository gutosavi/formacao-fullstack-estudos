import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './tasks/dto/create-task.dto';
import { UpdateTaskDto } from './tasks/dto/update-task.dto';
import { Task } from './tasks/model/task.model';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Get('/:id')
  findById(@Param('id') id: string): Promise<Task | null> {
    return this.taskService.findById(id);
  }

  @Post()
  createTask(@Body() body: CreateTaskDto): Promise<Task> {
    return this.taskService.create(body);
  }

  @Patch('/:id')
  updateTask(
    @Param('id') id: string,
    @Body() body: UpdateTaskDto,
  ): Promise<Task> {
    return this.taskService.update(id, body);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): Promise<void> {
    return this.taskService.delete(id);
  }
}
