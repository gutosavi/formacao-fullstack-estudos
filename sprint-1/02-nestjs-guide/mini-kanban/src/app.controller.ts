import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateTaskDto } from './tasks/dto/create-task.dto';

@Controller('messages')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  createMessage(@Body() body: CreateTaskDto): void {
    const { title, description, status } = body;

    console.log(
      `Title: ${title} Description: ${description} Status: ${status}`,
    );
  }

  @Get('/:id')
  getMessage(@Param('id') id: string): void {
    console.log(id);
  }
}
