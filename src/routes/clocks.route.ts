// routes/clientRoutes.ts
import express from 'express';
import * as clockController from '../controllers/clocks.controller';

const router = express.Router();

router.get('/', clockController.getClocks);
router.get('/:id', clockController.getClock);
router.post('/', clockController.createClock);
router.put('/:id', clockController.updateClock);
router.delete('/:id', clockController.deleteClock);

export default router;
