import { Router } from 'express';
import { validations } from '../middleware/validation.middleware.js';
import { ProductController } from '../controllers/product.controller.js';

const router = Router();
const controller = new ProductController();

// Get all products (with optional pagination and filters)
router.get('/', controller.list.bind(controller));

// Get product by ID
router.get('/:id', validations.validateId, controller.getById.bind(controller));

// Get product by code
router.get('/code/:code', controller.getByCode.bind(controller));

// Create new product
router.post('/', validations.validateCreateProduct, controller.create.bind(controller));

// Update product
router.put('/:id', validations.validateId, validations.validateUpdateProduct, controller.update.bind(controller));

// Delete product
router.delete('/:id', validations.validateId, controller.remove.bind(controller));

export default router;
