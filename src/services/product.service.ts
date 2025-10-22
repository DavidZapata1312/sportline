import { ProductDAO, ProductCreateData, ProductUpdateData, ProductQueryResult } from '../dao/product.dao.js';
import Product from '../models/product.model.js';

export class ProductService {
    private productDAO: ProductDAO;

    constructor() {
        this.productDAO = new ProductDAO();
    }

    async create(data: ProductCreateData): Promise<Product> {
        const exists = await this.productDAO.codeExists(data.code);
        if (exists) throw new Error('Product code already exists');
        if (data.stock === undefined || data.stock === null) data.stock = 0;
        return this.productDAO.create(data);
    }

    async getById(id: number): Promise<Product | null> {
        return this.productDAO.findById(id);
    }

    async getByCode(code: string): Promise<Product | null> {
        return this.productDAO.findByCode(code);
    }

    async list(filter: any = {}, pagination: any = {}): Promise<ProductQueryResult> {
        return this.productDAO.findAll(filter, pagination);
    }

    async update(id: number, data: ProductUpdateData): Promise<Product | null> {
        if (data.code) {
            const exists = await this.productDAO.codeExists(data.code, id);
            if (exists) throw new Error('Product code already exists');
        }
        return this.productDAO.update(id, data);
    }

    async remove(id: number): Promise<boolean> {
        return this.productDAO.delete(id);
    }

    async adjustStock(productId: number, adjustment: number) {
        return this.productDAO.adjustStock(productId, adjustment);
    }
}
