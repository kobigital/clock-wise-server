import express from 'express';
import { TimeIntervalController } from '../controllers/time-interval.controller';

const router = express.Router();
const timeIntervalController = new TimeIntervalController();

router.post('/', timeIntervalController.createTimeInterval);
router.get('/:id', timeIntervalController.getTimeIntervalById);
router.put('/:id', timeIntervalController.updateTimeInterval);
router.delete('/:id', timeIntervalController.deleteTimeInterval);

export default router;