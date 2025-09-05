import { Request, Response, NextFunction } from "express";
import * as taskService from "./task.service";

export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const tasks = await taskService.getByUserId(userId.toString());
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

export const getTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    const taskId = req.params.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const task = await taskService.getById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Check if the task belongs to the user
    if (task.createdBy?.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(task);
  } catch (err) {
    next(err);
  }
};

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const taskData = { ...req.body, createdBy: userId };
    const newTask = await taskService.create(taskData);
    res.status(201).json(newTask);
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    const taskId = req.params.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // First check if the task exists and belongs to the user
    const existingTask = await taskService.getById(taskId);
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (existingTask.createdBy?.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updated = await taskService.update(taskId, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    const taskId = req.params.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // First check if the task exists and belongs to the user
    const existingTask = await taskService.getById(taskId);
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (existingTask.createdBy?.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    await taskService.remove(taskId);
    res.json({ message: "Task deleted" });
  } catch (err) {
    next(err);
  }
};
