import { Task } from '../model/task.model';

export abstract class TaskRepository {
  abstract findAll(): Promise<Task[]>;
  abstract findById(id: string): Promise<Task | null>;
  abstract create(task: Task): Promise<Task>;
  abstract update(task: Task): Promise<Task>;
  abstract delete(id: string): Promise<void>;
}
