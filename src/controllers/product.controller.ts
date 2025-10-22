import { Request, Response } from 'express';
import { ProductService } from '../services/product.service.js';

const productService = new ProductService();

export class ProductController {
    async list(req: Request, res: Response) {
        try {
            const { page, limit, search, category, minPrice, maxPrice, inStock } = req.query as any;
            const filter: any = { search, category };
            if (minPrice !== undefined) filter.minPrice = Number(minPrice);
            if (maxPrice !== undefined) filter.maxPrice = Number(maxPrice);
            if (inStock !== undefined) filter.inStock = inStock === 'true';

            const result = await productService.list(filter, { page: Number(page) || 1, limit: Number(limit) || 10 });
            res.json({
                message: 'Products retrieved successfully',
                data: result.products,
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to retrieve products' });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const product = await productService.getById(id);
            if (!product) return res.status(404).json({ error: 'Product not found' });
            res.json({ message: 'Product retrieved successfully', data: product });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to retrieve product' });
        }
    }

    async getByCode(req: Request, res: Response) {
        try {
            const { code } = req.params as any;
            const product = await productService.getByCode(code);
            if (!product) {
                return res.status(404).json({
                    error: 'Product not found',
                    message: `Product with code '${code}' not found`
                });
            }
            res.json({ message: 'Product retrieved successfully', data: product });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to retrieve product' });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const product = await productService.create(req.body);
            res.status(201).json({ message: 'Product created successfully', data: product });
        } catch (error: any) {
            const status = error.message?.includes('exists') ? 409 : 400;
            res.status(status).json({ error: error.message || 'Failed to create product' });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const updated = await productService.update(id, req.body);
            if (!updated) return res.status(404).json({ error: 'Product not found' });
            res.json({ message: 'Product updated successfully', data: updated });
        } catch (error: any) {
            const status = error.message?.includes('exists') ? 409 : 400;
            res.status(status).json({ error: error.message || 'Failed to update product' });
        }
    }

    async remove(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const ok = await productService.remove(id);
            if (!ok) return res.status(404).json({ error: 'Product not found' });
            res.json({ message: 'Product deleted successfully' });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to delete product' });
        }
    }
}
