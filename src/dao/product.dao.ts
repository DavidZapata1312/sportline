import Product from '../models/product.model.js';
import { CreateProductDTO, UpdateProductDTO, ProductFilterDTO } from '../dtos/product.dto.js';
import { WhereOptions, Op } from 'sequelize';

export interface ProductCreateData {
    code: string;
    name: string;
    description?: string;
    price: number;
    category: string;
    stock: number;
}

export interface ProductUpdateData {
    code?: string;
    name?: string;
    description?: string;
    price?: number;
    category?: string;
    stock?: number;
}

export interface ProductFilter {
    id?: number;
    code?: string;
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    search?: string;
}

export interface PaginationOptions {
    page?: number;
    limit?: number;
}

export interface ProductQueryResult {
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export class ProductDAO {

    /**
     * Create a new product
     */
    async create(productData: ProductCreateData): Promise<Product> {
        try {
            return await Product.create(productData);
        } catch (error: any) {
            throw new Error(`Failed to create product: ${error.message}`);
        }
    }

    /**
     * Find product by ID
     */
    async findById(id: number): Promise<Product | null> {
        try {
            return await Product.findByPk(id);
        } catch (error: any) {
            throw new Error(`Failed to find product by ID: ${error.message}`);
        }
    }

    /**
     * Find product by code
     */
    async findByCode(code: string): Promise<Product | null> {
        try {
            return await Product.findOne({ where: { code } });
        } catch (error: any) {
            throw new Error(`Failed to find product by code: ${error.message}`);
        }
    }

    /**
     * Find all products with optional filters and pagination
     */
    async findAll(
        filter: ProductFilter = {},
        pagination: PaginationOptions = {}
    ): Promise<ProductQueryResult> {
        try {
            const { page = 1, limit = 10 } = pagination;
            const offset = (page - 1) * limit;
            
            const whereClause = this.buildWhereClause(filter);
            
            const { rows: products, count: total } = await Product.findAndCountAll({
                where: whereClause,
                limit,
                offset,
                order: [['createdAt', 'DESC']]
            });

            const totalPages = Math.ceil(total / limit);

            return {
                products,
                total,
                page,
                limit,
                totalPages
            };
        } catch (error: any) {
            throw new Error(`Failed to find products: ${error.message}`);
        }
    }

    /**
     * Update product by ID
     */
    async update(id: number, updateData: ProductUpdateData): Promise<Product | null> {
        try {
            const product = await Product.findByPk(id);
            if (!product) {
                return null;
            }
            
            await product.update(updateData);
            return product;
        } catch (error: any) {
            throw new Error(`Failed to update product: ${error.message}`);
        }
    }

    /**
     * Delete product by ID
     */
    async delete(id: number): Promise<boolean> {
        try {
            const product = await Product.findByPk(id);
            if (!product) {
                return false;
            }
            
            await product.destroy();
            return true;
        } catch (error: any) {
            throw new Error(`Failed to delete product: ${error.message}`);
        }
    }

    /**
     * Check if product code already exists
     */
    async codeExists(code: string, excludeId?: number): Promise<boolean> {
        try {
            const whereClause: WhereOptions = { code };
            if (excludeId) {
                whereClause.id = { [Op.ne]: excludeId };
            }
            
            const product = await Product.findOne({ where: whereClause });
            return !!product;
        } catch (error: any) {
            throw new Error(`Failed to check code existence: ${error.message}`);
        }
    }

    /**
     * Get products by category
     */
    async findByCategory(category: string, pagination: PaginationOptions = {}): Promise<ProductQueryResult> {
        return this.findAll({ category }, pagination);
    }

    /**
     * Get products in stock
     */
    async findInStock(pagination: PaginationOptions = {}): Promise<ProductQueryResult> {
        return this.findAll({ inStock: true }, pagination);
    }

    /**
     * Get products by price range
     */
    async findByPriceRange(
        minPrice: number,
        maxPrice: number,
        pagination: PaginationOptions = {}
    ): Promise<ProductQueryResult> {
        return this.findAll({ minPrice, maxPrice }, pagination);
    }

    /**
     * Search products by name or description
     */
    async search(query: string, pagination: PaginationOptions = {}): Promise<ProductQueryResult> {
        return this.findAll({ search: query }, pagination);
    }

    /**
     * Count total products
     */
    async count(filter: ProductFilter = {}): Promise<number> {
        try {
            const whereClause = this.buildWhereClause(filter);
            return await Product.count({ where: whereClause });
        } catch (error: any) {
            throw new Error(`Failed to count products: ${error.message}`);
        }
    }

    /**
     * Get all unique categories
     */
    async getCategories(): Promise<string[]> {
        try {
            const products = await Product.findAll({
                attributes: ['category'],
                group: ['category'],
                raw: true
            });
            
            return products.map((p: any) => p.category);
        } catch (error: any) {
            throw new Error(`Failed to get categories: ${error.message}`);
        }
    }

    /**
     * Update stock for a product
     */
    async updateStock(id: number, quantity: number): Promise<Product | null> {
        try {
            const product = await Product.findByPk(id);
            if (!product) {
                return null;
            }
            
            await product.update({ stock: quantity });
            return product;
        } catch (error: any) {
            throw new Error(`Failed to update stock: ${error.message}`);
        }
    }

    /**
     * Increment/decrement stock
     */
    async adjustStock(id: number, adjustment: number): Promise<Product | null> {
        try {
            const product = await Product.findByPk(id);
            if (!product) {
                return null;
            }
            
            const newStock = Math.max(0, product.stock + adjustment);
            await product.update({ stock: newStock });
            return product;
        } catch (error: any) {
            throw new Error(`Failed to adjust stock: ${error.message}`);
        }
    }

    /**
     * Build WHERE clause for filtering
     */
    private buildWhereClause(filter: ProductFilter): WhereOptions {
        const where: WhereOptions = {};

        if (filter.id) {
            where.id = filter.id;
        }

        if (filter.code) {
            where.code = filter.code;
        }

        if (filter.category) {
            where.category = filter.category;
        }

        if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
            where.price = {};
            if (filter.minPrice !== undefined) {
                (where.price as any)[Op.gte] = filter.minPrice;
            }
            if (filter.maxPrice !== undefined) {
                (where.price as any)[Op.lte] = filter.maxPrice;
            }
        }

        if (filter.inStock !== undefined) {
            if (filter.inStock) {
                where.stock = { [Op.gt]: 0 };
            } else {
                where.stock = { [Op.lte]: 0 };
            }
        }

        if (filter.search) {
            (where as any)[Op.or] = [
                { name: { [Op.iLike]: `%${filter.search}%` } },
                { description: { [Op.iLike]: `%${filter.search}%` } },
                { code: { [Op.iLike]: `%${filter.search}%` } }
            ];
        }

        return where;
    }
}