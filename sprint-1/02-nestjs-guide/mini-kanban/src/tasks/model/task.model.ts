export type TaskStatus = 'TODO' | 'DOING' | 'DONE';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  position: number;
  createdAt: Date | string;
  updatedAt?: Date | string;
}
