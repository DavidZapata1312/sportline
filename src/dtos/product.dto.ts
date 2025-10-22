export interface CreateProductDTO {
    code: string;
    name: string;
    description?: string;
    price: number;
    category: string;
    stock?: number;
}

export interface UpdateProductDTO {
    code?: string;
    name?: string;
    description?: string;
    price?: number;
    category?: string;
    stock?: number;
}

export interface ProductResponseDTO {
    id: number;
    code: string;
    name: string;
    description?: string;
    price: number;
    category: string;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProductListResponseDTO {
    message: string;
    data: ProductResponseDTO[];
    total?: number;
    page?: number;
    limit?: number;
}

export interface ProductFilterDTO {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    search?: string;
}