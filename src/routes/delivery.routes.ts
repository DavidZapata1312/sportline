import { Router } from 'express';
import { DeliveryController } from '../controllers/delivery.controller.js';
import { validations } from '../middleware/validation.middleware.js';

const router = Router();
const controller = new DeliveryController();

// Register a delivery with various products (stock validated inside service)
router.post('/', validations.validateCreateDelivery, controller.create.bind(controller));

// Get delivery history for a client
router.get('/client/:clientId/history', validations.validateClientId, controller.clientHistory.bind(controller));

export default router;
