import { Router } from 'express';
import taskRoutes from '../modules/tasks/task.route';

export const router = Router();

router.use('/tasks', taskRoutes);
