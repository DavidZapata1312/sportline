import { Router } from 'express';
import { validations } from '../middleware/validation.middleware.js';
import { ClientController } from '../controllers/client.controller.js';

const router = Router();
const controller = new ClientController();

// Get all clients (with optional pagination and search)
router.get('/', controller.list.bind(controller));

// Get client by ID
router.get('/:id', validations.validateId, controller.getById.bind(controller));

// Create new client
router.post('/', validations.validateCreateClient, controller.create.bind(controller));

// Update client
router.put('/:id', validations.validateId, validations.validateUpdateClient, controller.update.bind(controller));

// Delete client
router.delete('/:id', validations.validateId, controller.remove.bind(controller));

export default router;
