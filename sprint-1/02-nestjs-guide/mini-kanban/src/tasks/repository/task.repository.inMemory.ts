import { Injectable } from '@nestjs/common';
import { Task } from '../model/task.model';
import { TaskRepository } from './task.repository';

@Injectable()
export class TaskRepositoryInMemory extends TaskRepository {
  private tasks: Task[] = [];

  async findAll(): Promise<Task[]> {
    return this.tasks;
  }

  async findById(id: string): Promise<Task | null> {
    return this.tasks.find((t) => t.id === id) ?? null;
  }

  async create(task: Task): Promise<Task> {
    this.tasks.push(task);
    return task;
  }

  async update(task: Task): Promise<Task> {
    const index = this.tasks.findIndex((t) => t.id === task.id);
    this.tasks[index] = task;
    return task;
  }

  async delete(id: string): Promise<void> {
    const index = this.tasks.findIndex((t) => t.id === id);
    this.tasks.splice(index, 1);
  }
}
