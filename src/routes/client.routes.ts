import { Router, Request, Response } from 'express';
import Client from '../models/client.model.js';

const router = Router();

// Get all clients
router.get('/', async (req: Request, res: Response) => {
    try {
        const clients = await Client.findAll();
        res.json({
            message: 'Clients retrieved successfully',
            data: clients
        });
    } catch (error: any) {
        res.status(500).json({ 
            error: error.message || 'Failed to retrieve clients' 
        });
    }
});

// Get client by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const client = await Client.findByPk(id);
        
        if (!client) {
            return res.status(404).json({ 
                error: 'Client not found' 
            });
        }
        
        res.json({
            message: 'Client retrieved successfully',
            data: client
        });
    } catch (error: any) {
        res.status(500).json({ 
            error: error.message || 'Failed to retrieve client' 
        });
    }
});

// Create new client
router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, email, phone, address } = req.body;
        
        // Basic validation
        if (!name || !email) {
            return res.status(400).json({ 
                error: 'Name and email are required' 
            });
        }

        const client = await Client.create({
            name,
            email,
            phone,
            address
        });
        
        res.status(201).json({
            message: 'Client created successfully',
            data: client
        });
    } catch (error: any) {
        res.status(400).json({ 
            error: error.message || 'Failed to create client' 
        });
    }
});

// Update client
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, email, phone, address } = req.body;
        
        const client = await Client.findByPk(id);
        if (!client) {
            return res.status(404).json({ 
                error: 'Client not found' 
            });
        }

        await client.update({
            name: name || client.name,
            email: email || client.email,
            phone: phone !== undefined ? phone : client.phone,
            address: address !== undefined ? address : client.address
        });
        
        res.json({
            message: 'Client updated successfully',
            data: client
        });
    } catch (error: any) {
        res.status(400).json({ 
            error: error.message || 'Failed to update client' 
        });
    }
});

// Delete client
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        const client = await Client.findByPk(id);
        if (!client) {
            return res.status(404).json({ 
                error: 'Client not found' 
            });
        }

        await client.destroy();
        
        res.json({
            message: 'Client deleted successfully'
        });
    } catch (error: any) {
        res.status(500).json({ 
            error: error.message || 'Failed to delete client' 
        });
    }
});

export default router;