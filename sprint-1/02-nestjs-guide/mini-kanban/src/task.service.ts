import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './tasks/dto/create-task.dto';
import { Task } from './tasks/model/task.model';
import { TaskRepository } from './tasks/repository/task.repository';

@Injectable()
export class TaskService {
  constructor(private readonly tasksRepo: TaskRepository) {}
  findAll() {
    return this.tasksRepo.findAll();
  }

  findById(id: string) {
    return this.tasksRepo.findById(id);
  }

  async create(dto: CreateTaskDto): Promise<Task> {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: dto.title,
      description: dto.description || '',
      status: 'TODO',
      position: 0,
      createdAt: new Date(),
    };

    return this.tasksRepo.create(newTask);
  }

  async update(id: string, dto: CreateTaskDto): Promise<Task> {
    const task = await this.tasksRepo.findById(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const updatedTask = {
      ...task,
      ...dto,
      updatedAt: new Date(),
      id,
    };

    // outras regras entrariam aqui, por exemplo:
    // se o status mudou, recalcular a position na nova coluna

    console.log('Updated task:', updatedTask); // Só para testes
    return this.tasksRepo.update(updatedTask);
  }

  async delete(id: string): Promise<void> {
    const task = await this.tasksRepo.findById(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    console.log('Deleting task:', task); // Só para testes
    this.tasksRepo.delete(task.id);
  }
}
