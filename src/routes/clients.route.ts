import express from 'express';
import { ClientController } from '../controllers/clients.controller';
import { ClockController } from '../controllers/clocks.controller';

const router = express.Router();
const clientController = new ClientController();
const clockController = new ClockController();

router.post('/', clientController.createClient);
router.get('/:id', clientController.getClientById);
router.get('', clientController.getClientsByUserId);
router.put('/:id', clientController.updateClient);
router.delete('/:id', clientController.deleteClient);
router.get('/:clientId/clocks', clockController.getClocksByClientId);

export default router;