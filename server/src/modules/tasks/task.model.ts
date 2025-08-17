import { Schema, model, Document } from 'mongoose';

export interface TaskDocument extends Document {
  title: string;
  description?: string;
  dueDate?: Date;
  status?: string;
  priority?: string;
}

const taskSchema = new Schema<TaskDocument>({
  title: { type: String, required: true },
  description: String,
  dueDate: Date,
  status: { type: String, default: 'todo' },
  priority: { type: String, default: 'medium' }
}, { timestamps: true });

export const Task = model<TaskDocument>('Task', taskSchema);
