import express from 'express';
import { ClockController } from '../controllers/clocks.controller';
import { TimeIntervalController } from '../controllers/time-interval.controller';

const router = express.Router();
const clockController = new ClockController();
const timeIntervalController = new TimeIntervalController();

router.post('/', clockController.createClock);
router.get('/:id', clockController.getClockById);
router.put('/:id', clockController.updateClock);
router.delete('/:id', clockController.deleteClock);
router.get('/:clockId/timeIntervals', timeIntervalController.getTimeIntervalsByClockId);

export default router;