import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TaskRepository } from './tasks/repository/task.repository';
import { TaskRepositoryInMemory } from './tasks/repository/task.repository.inMemory';

@Module({
  imports: [],
  controllers: [TaskController],
  providers: [
    TaskService,
    { provide: TaskRepository, useClass: TaskRepositoryInMemory },
  ],
})
export class TaskModule {}
