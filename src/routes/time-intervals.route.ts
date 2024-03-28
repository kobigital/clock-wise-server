// routes/clientRoutes.ts
import express from 'express';
import * as clientController from '../controllers/time-interval.controller';

const router = express.Router();

router.get('/', clientController.getTimeIntervals);
router.get('/:id', clientController.getTimeInterval);
router.post('/', clientController.createTimeInterval);
router.put('/:id', clientController.updateTimeInterval);
router.delete('/:id', clientController.deleteTimeInterval);

export default router;
