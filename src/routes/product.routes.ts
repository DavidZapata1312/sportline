import { Router, Request, Response } from 'express';
import Product from '../models/product.model.js';
import { validations } from '../middleware/validation.middleware.js';
import { CreateProductDTO, UpdateProductDTO, ProductResponseDTO } from '../dtos/product.dto.js';

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
router.get('/:id', validations.validateId, async (req: Request, res: Response) => {
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
router.post('/', validations.validateCreateProduct, async (req: Request, res: Response) => {
    try {
        const productData: CreateProductDTO = req.body;
        
        // Check if code already exists
        const existingProduct = await Product.findOne({ where: { code: productData.code } });
        if (existingProduct) {
            return res.status(409).json({ 
                error: 'Product code already exists',
                message: `Product with code '${productData.code}' already exists` 
            });
        }

        const product = await Product.create({
            ...productData,
            stock: productData.stock || 0
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
router.put('/:id', validations.validateId, validations.validateUpdateProduct, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData: UpdateProductDTO = req.body;
        
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ 
                error: 'Product not found' 
            });
        }

        // If code is being updated, check if it already exists
        if (updateData.code && updateData.code !== product.code) {
            const existingProduct = await Product.findOne({ where: { code: updateData.code } });
            if (existingProduct) {
                return res.status(409).json({ 
                    error: 'Product code already exists',
                    message: `Product with code '${updateData.code}' already exists` 
                });
            }
        }

        await product.update({
            code: updateData.code || product.code,
            name: updateData.name || product.name,
            description: updateData.description !== undefined ? updateData.description : product.description,
            price: updateData.price || product.price,
            category: updateData.category || product.category,
            stock: updateData.stock !== undefined ? updateData.stock : product.stock
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
router.delete('/:id', validations.validateId, async (req: Request, res: Response) => {
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