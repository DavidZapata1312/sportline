import { Router, Request, Response } from 'express';
import Client from '../models/client.model.js';
import { validations } from '../middleware/validation.middleware.js';
import { CreateClientDTO, UpdateClientDTO, ClientResponseDTO } from '../dtos/client.dto.js';

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
router.get('/:id', validations.validateId, async (req: Request, res: Response) => {
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
router.post('/', validations.validateCreateClient, async (req: Request, res: Response) => {
    try {
        const clientData: CreateClientDTO = req.body;
        
        // Check if email already exists
        const existingClient = await Client.findOne({ where: { email: clientData.email } });
        if (existingClient) {
            return res.status(409).json({ 
                error: 'Email already exists',
                message: `Client with email '${clientData.email}' already exists` 
            });
        }

        const client = await Client.create(clientData);
        
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
router.put('/:id', validations.validateId, validations.validateUpdateClient, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData: UpdateClientDTO = req.body;
        
        const client = await Client.findByPk(id);
        if (!client) {
            return res.status(404).json({ 
                error: 'Client not found' 
            });
        }

        // Check if email is being updated and already exists
        if (updateData.email && updateData.email !== client.email) {
            const existingClient = await Client.findOne({ where: { email: updateData.email } });
            if (existingClient) {
                return res.status(409).json({ 
                    error: 'Email already exists',
                    message: `Client with email '${updateData.email}' already exists` 
                });
            }
        }

        await client.update({
            name: updateData.name || client.name,
            email: updateData.email || client.email,
            phone: updateData.phone !== undefined ? updateData.phone : client.phone,
            address: updateData.address !== undefined ? updateData.address : client.address
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
router.delete('/:id', validations.validateId, async (req: Request, res: Response) => {
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