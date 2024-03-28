// routes/clientRoutes.ts
import express from 'express';
import * as clientController from '../controllers/clients.controller';

const router = express.Router();

router.get('/', clientController.getClients);
router.get('/:id', clientController.getClient);
router.post('/', clientController.createClient);
router.put('/:id', clientController.updateClient);
router.delete('/:id', clientController.deleteClient);

export default router;
