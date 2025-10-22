import { Router, Request, Response } from 'express';
import Product from '../models/product.model.js';

const router = Router();

// Get all products
router.get('/', async (req: Request, res: Response) => {
    try {
        const products = await Product.findAll();
        res.json({
            message: 'Products retrieved successfully',
            data: products
        });
    } catch (error: any) {
        res.status(500).json({ 
            error: error.message || 'Failed to retrieve products' 
        });
    }
});

// Get product by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);
        
        if (!product) {
            return res.status(404).json({ 
                error: 'Product not found' 
            });
        }
        
        res.json({
            message: 'Product retrieved successfully',
            data: product
        });
    } catch (error: any) {
        res.status(500).json({ 
            error: error.message || 'Failed to retrieve product' 
        });
    }
});

// Create new product
router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, description, price, category, stock } = req.body;
        
        // Basic validation
        if (!name || !price || !category) {
            return res.status(400).json({ 
                error: 'Name, price, and category are required' 
            });
        }

        const product = await Product.create({
            name,
            description,
            price,
            category,
            stock: stock || 0
        });
        
        res.status(201).json({
            message: 'Product created successfully',
            data: product
        });
    } catch (error: any) {
        res.status(400).json({ 
            error: error.message || 'Failed to create product' 
        });
    }
});

// Update product
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, stock } = req.body;
        
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ 
                error: 'Product not found' 
            });
        }

        await product.update({
            name: name || product.name,
            description: description !== undefined ? description : product.description,
            price: price || product.price,
            category: category || product.category,
            stock: stock !== undefined ? stock : product.stock
        });
        
        res.json({
            message: 'Product updated successfully',
            data: product
        });
    } catch (error: any) {
        res.status(400).json({ 
            error: error.message || 'Failed to update product' 
        });
    }
});

// Delete product
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ 
                error: 'Product not found' 
            });
        }

        await product.destroy();
        
        res.json({
            message: 'Product deleted successfully'
        });
    } catch (error: any) {
        res.status(500).json({ 
            error: error.message || 'Failed to delete product' 
        });
    }
});

export default router;