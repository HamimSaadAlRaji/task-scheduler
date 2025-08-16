import { Router } from 'express';
import * as controller from './task.controller';

const router = Router();

router.get('/', controller.getTasks);
router.get('/:id', controller.getTask);
router.post('/', controller.createTask);
router.put('/:id', controller.updateTask);
router.delete('/:id', controller.deleteTask);

export default router;
