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

// Get product by code
router.get('/code/:code', async (req: Request, res: Response) => {
    try {
        const { code } = req.params;
        const product = await Product.findOne({ where: { code } });
        
        if (!product) {
            return res.status(404).json({ 
                error: 'Product not found',
                message: `Product with code '${code}' not found`
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
        const { code, name, description, price, category, stock } = req.body;
        
        // Basic validation
        if (!code || !name || !price || !category) {
            return res.status(400).json({ 
                error: 'Code, name, price, and category are required' 
            });
        }

        // Check if code already exists
        const existingProduct = await Product.findOne({ where: { code } });
        if (existingProduct) {
            return res.status(409).json({ 
                error: 'Product code already exists',
                message: `Product with code '${code}' already exists` 
            });
        }

        const product = await Product.create({
            code,
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
        const { code, name, description, price, category, stock } = req.body;
        
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ 
                error: 'Product not found' 
            });
        }

        // If code is being updated, check if it already exists
        if (code && code !== product.code) {
            const existingProduct = await Product.findOne({ where: { code } });
            if (existingProduct) {
                return res.status(409).json({ 
                    error: 'Product code already exists',
                    message: `Product with code '${code}' already exists` 
                });
            }
        }

        await product.update({
            code: code || product.code,
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