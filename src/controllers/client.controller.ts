import { Request, Response } from 'express';
import { ClientService } from '../services/client.service.js';

const clientService = new ClientService();

export class ClientController {
    async list(req: Request, res: Response) {
        try {
            const { page, limit, search } = req.query as any;
            const result = await clientService.list({ search }, { page: Number(page) || 1, limit: Number(limit) || 10 });
            res.json({
                message: 'Clients retrieved successfully',
                data: result.clients,
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to retrieve clients' });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const client = await clientService.getById(id);
            if (!client) return res.status(404).json({ error: 'Client not found' });
            res.json({ message: 'Client retrieved successfully', data: client });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to retrieve client' });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const client = await clientService.create(req.body);
            res.status(201).json({ message: 'Client created successfully', data: client });
        } catch (error: any) {
            const status = error.message?.includes('exists') ? 409 : 400;
            res.status(status).json({ error: error.message || 'Failed to create client' });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const updated = await clientService.update(id, req.body);
            if (!updated) return res.status(404).json({ error: 'Client not found' });
            res.json({ message: 'Client updated successfully', data: updated });
        } catch (error: any) {
            const status = error.message?.includes('exists') ? 409 : 400;
            res.status(status).json({ error: error.message || 'Failed to update client' });
        }
    }

    async remove(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const ok = await clientService.remove(id);
            if (!ok) return res.status(404).json({ error: 'Client not found' });
            res.json({ message: 'Client deleted successfully' });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to delete client' });
        }
    }
}
