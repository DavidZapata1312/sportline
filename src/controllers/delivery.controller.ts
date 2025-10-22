import { Request, Response } from 'express';
import { DeliveryService } from '../services/delivery.service.js';

const deliveryService = new DeliveryService();

export class DeliveryController {
    async create(req: Request, res: Response) {
        try {
            const delivery = await deliveryService.create(req.body);
            res.status(201).json({ message: 'Delivery created successfully', data: delivery });
        } catch (error: any) {
            const message = error.message || 'Failed to create delivery';
            const status = message.includes('not found') ? 404 : message.includes('stock') ? 409 : 400;
            res.status(status).json({ error: message });
        }
    }

    async clientHistory(req: Request, res: Response) {
        try {
            const clientId = Number(req.params.clientId);
            const { page, limit } = req.query as any;
            const result = await deliveryService.getClientHistory(clientId, Number(page) || 1, Number(limit) || 10);
            res.json({
                message: 'Client delivery history retrieved successfully',
                data: result.deliveries,
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to retrieve client history' });
        }
    }
}
