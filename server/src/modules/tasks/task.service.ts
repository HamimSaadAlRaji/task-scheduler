import { Task, TaskDocument } from './task.model';

export const getAll = () => Task.find().exec();

export const getById = (id: string) => Task.findById(id).exec();

export const create = (data: Partial<TaskDocument>) => new Task(data).save();

export const update = (id: string, data: Partial<TaskDocument>) => Task.findByIdAndUpdate(id, data, { new: true }).exec();

export const remove = (id: string) => Task.findByIdAndDelete(id).exec();
