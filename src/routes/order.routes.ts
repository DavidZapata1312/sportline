import { Router, Request, Response } from 'express';
import { OrderDAO } from '../dao/order.dao.js';
import { CreateOrderDTO } from '../dtos/order.dto.js';

const router = Router();
const orderDAO = new OrderDAO();

// Create order - validates stock and reduces inventory automatically
router.post('/', async (req: Request, res: Response) => {
    try {
        const body: CreateOrderDTO = req.body;

        // Basic validation
        if (!body || typeof body.clientId !== 'number') {
            return res.status(400).json({ error: 'clientId is required and must be a number' });
        }
        if (!Array.isArray(body.items) || body.items.length === 0) {
            return res.status(400).json({ error: 'items array is required' });
        }
        for (const item of body.items) {
            if (typeof item.productId !== 'number' || typeof item.quantity !== 'number') {
                return res.status(400).json({ error: 'Each item must have productId and quantity as numbers' });
            }
            if (item.quantity <= 0) {
                return res.status(400).json({ error: 'Quantity must be greater than 0' });
            }
        }

        const order = await orderDAO.createOrder({ clientId: body.clientId, items: body.items });
        const full = await orderDAO.findById(order.id);

        res.status(201).json({
            message: 'Order created successfully',
            data: full
        });
    } catch (error: any) {
        const msg = String(error?.message || 'Failed to create order');
        const status = /not found|invalid|insufficient stock/i.test(msg) ? 422 : 400;
        res.status(status).json({ error: msg });
    }
});

// Get orders with filters (by client or product)
router.get('/', async (req: Request, res: Response) => {
    try {
        const clientId = req.query.clientId ? Number(req.query.clientId) : undefined;
        const productId = req.query.productId ? Number(req.query.productId) : undefined;
        const page = req.query.page ? Number(req.query.page) : 1;
        const limit = req.query.limit ? Number(req.query.limit) : 10;

        const result = await orderDAO.findAll({ clientId, productId }, { page, limit });
        res.json({
            message: 'Orders retrieved successfully',
            data: result.orders,
            pagination: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages,
                hasNext: result.page < result.totalPages,
                hasPrev: result.page > 1
            }
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to retrieve orders' });
    }
});

// Get single order by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }
        const order = await orderDAO.findById(id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json({ message: 'Order retrieved successfully', data: order });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to retrieve order' });
    }
});

export default router;
