# Sportline API - DAO Implementation & Response Schemas

## Overview

This document describes the complete implementation of Data Access Objects (DAOs) for products and clients, along with standardized response schemas and examples.

## ✅ Implemented Components

### 1. **Product DAO** (`src/dao/product.dao.ts`)

**Features:**
- ✅ Complete CRUD operations
- ✅ Advanced filtering and search
- ✅ Pagination support
- ✅ Stock management
- ✅ Category management
- ✅ Price range queries
- ✅ Code uniqueness validation

**Methods:**
```typescript
// Basic CRUD
create(productData: ProductCreateData): Promise<Product>
findById(id: number): Promise<Product | null>
findByCode(code: string): Promise<Product | null>
update(id: number, updateData: ProductUpdateData): Promise<Product | null>
delete(id: number): Promise<boolean>

// Advanced Queries
findAll(filter?: ProductFilter, pagination?: PaginationOptions): Promise<ProductQueryResult>
search(query: string, pagination?: PaginationOptions): Promise<ProductQueryResult>
findByCategory(category: string, pagination?: PaginationOptions): Promise<ProductQueryResult>
findInStock(pagination?: PaginationOptions): Promise<ProductQueryResult>
findByPriceRange(minPrice: number, maxPrice: number, pagination?: PaginationOptions): Promise<ProductQueryResult>

// Utility Methods
codeExists(code: string, excludeId?: number): Promise<boolean>
getCategories(): Promise<string[]>
updateStock(id: number, quantity: number): Promise<Product | null>
adjustStock(id: number, adjustment: number): Promise<Product | null>
count(filter?: ProductFilter): Promise<number>
```

**Filter Options:**
- `id`, `code`, `name`, `category`
- `minPrice`, `maxPrice`
- `inStock` (boolean)
- `search` (full-text across name, description, code)

### 2. **Client DAO** (`src/dao/client.dao.ts`)

**Features:**
- ✅ Complete CRUD operations
- ✅ Advanced filtering and search
- ✅ Pagination support
- ✅ Email uniqueness validation
- ✅ Contact information queries
- ✅ Recent clients tracking
- ✅ Bulk operations

**Methods:**
```typescript
// Basic CRUD
create(clientData: ClientCreateData): Promise<Client>
findById(id: number): Promise<Client | null>
findByEmail(email: string): Promise<Client | null>
update(id: number, updateData: ClientUpdateData): Promise<Client | null>
delete(id: number): Promise<boolean>

// Advanced Queries
findAll(filter?: ClientFilter, pagination?: PaginationOptions): Promise<ClientQueryResult>
search(query: string, pagination?: PaginationOptions): Promise<ClientQueryResult>
findByName(name: string, pagination?: PaginationOptions): Promise<ClientQueryResult>
findWithPhone(pagination?: PaginationOptions): Promise<ClientQueryResult>
findWithAddress(pagination?: PaginationOptions): Promise<ClientQueryResult>
findRecent(days?: number, pagination?: PaginationOptions): Promise<ClientQueryResult>

// Utility Methods
emailExists(email: string, excludeId?: number): Promise<boolean>
bulkCreate(clientsData: ClientCreateData[]): Promise<Client[]>
count(filter?: ClientFilter): Promise<number>
```

**Filter Options:**
- `id`, `name`, `email`, `phone`
- `search` (full-text across name, email, phone, address)

### 3. **Response Schemas** (`src/schemas/responses.ts`)

**Base Response Types:**
```typescript
interface BaseResponse {
    success: boolean;
    message: string;
    timestamp: string;
}

interface ErrorResponse extends BaseResponse {
    success: false;
    error: string;
    details?: any[];
    fields?: string[];
}

interface SuccessResponse<T> extends BaseResponse {
    success: true;
    data: T;
}

interface PaginatedResponse<T> extends SuccessResponse<T[]> {
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
```

**Specific Response Types:**
- `ClientResponse`, `ClientListResponse`, `SingleClientResponse`
- `ProductResponse`, `ProductListResponse`, `SingleProductResponse`
- `AuthResponse`, `TokenRefreshResponse`
- `DashboardStatsResponse`

## 📋 API Endpoint Examples

### Products

#### Get All Products
```http
GET /api/products?page=1&limit=10&category=Fútbol&minPrice=20&maxPrice=100&search=nike

Response:
{
    "success": true,
    "message": "Products retrieved successfully",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "data": [
        {
            "id": 1,
            "code": "NIKE-FB001",
            "name": "Balón de fútbol Nike",
            "description": "Balón oficial de la liga, tamaño 5",
            "price": 49.99,
            "category": "Fútbol",
            "stock": 10,
            "createdAt": "2024-01-15T10:30:00.000Z",
            "updatedAt": "2024-01-15T10:30:00.000Z"
        }
    ],
    "pagination": {
        "total": 50,
        "page": 1,
        "limit": 10,
        "totalPages": 5,
        "hasNext": true,
        "hasPrev": false
    }
}
```

#### Create Product
```http
POST /api/products
Content-Type: application/json

{
    "code": "ADIDAS-FB002",
    "name": "Balón Adidas Champions League",
    "description": "Balón oficial Champions League 2024",
    "price": 65.99,
    "category": "Fútbol",
    "stock": 15
}

Response:
{
    "success": true,
    "message": "Product created successfully",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "data": {
        "id": 4,
        "code": "ADIDAS-FB002",
        "name": "Balón Adidas Champions League",
        "description": "Balón oficial Champions League 2024",
        "price": 65.99,
        "category": "Fútbol",
        "stock": 15,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
    }
}
```

### Clients

#### Get All Clients
```http
GET /api/clients?page=1&limit=10&search=juan

Response:
{
    "success": true,
    "message": "Clients retrieved successfully",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "data": [
        {
            "id": 1,
            "name": "Juan Pérez",
            "email": "juan.perez@email.com",
            "phone": "+1234567890",
            "address": "123 Main St, City, Country",
            "createdAt": "2024-01-15T10:30:00.000Z",
            "updatedAt": "2024-01-15T10:30:00.000Z"
        }
    ],
    "pagination": {
        "total": 25,
        "page": 1,
        "limit": 10,
        "totalPages": 3,
        "hasNext": true,
        "hasPrev": false
    }
}
```

#### Create Client
```http
POST /api/clients
Content-Type: application/json

{
    "name": "Ana García",
    "email": "ana.garcia@email.com",
    "phone": "+1555123456",
    "address": "789 Pine St, City, Country"
}

Response:
{
    "success": true,
    "message": "Client created successfully",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "data": {
        "id": 5,
        "name": "Ana García",
        "email": "ana.garcia@email.com",
        "phone": "+1555123456",
        "address": "789 Pine St, City, Country",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
    }
}
```

## 🔍 Error Response Examples

### Validation Error
```json
{
    "success": false,
    "message": "Validation failed",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "error": "Validation failed",
    "details": [
        {
            "field": "email",
            "message": "Invalid email format",
            "value": "invalid-email"
        }
    ],
    "fields": ["email"]
}
```

### Resource Not Found
```json
{
    "success": false,
    "message": "Resource not found",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "error": "Product not found"
}
```

### Duplicate Resource
```json
{
    "success": false,
    "message": "Resource already exists",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "error": "Product code already exists",
    "details": ["Product with code 'NIKE-FB001' already exists"]
}
```

## 🔧 Integration Examples

### Using Product DAO in Service
```typescript
import { ProductDAO } from '../dao/product.dao.js';

export class ProductService {
    private productDAO: ProductDAO;

    constructor() {
        this.productDAO = new ProductDAO();
    }

    async getProducts(filters: any, pagination: any) {
        return await this.productDAO.findAll(filters, pagination);
    }

    async createProduct(productData: any) {
        // Check if code exists
        if (await this.productDAO.codeExists(productData.code)) {
            throw new Error('Product code already exists');
        }
        
        return await this.productDAO.create(productData);
    }
}
```

### Using Client DAO in Service
```typescript
import { ClientDAO } from '../dao/client.dao.js';

export class ClientService {
    private clientDAO: ClientDAO;

    constructor() {
        this.clientDAO = new ClientDAO();
    }

    async getClients(filters: any, pagination: any) {
        return await this.clientDAO.findAll(filters, pagination);
    }

    async createClient(clientData: any) {
        // Check if email exists
        if (await this.clientDAO.emailExists(clientData.email)) {
            throw new Error('Email already exists');
        }
        
        return await this.clientDAO.create(clientData);
    }
}
```

## 📊 HTTP Status Codes

- `200 OK` - Successful GET, PUT requests
- `201 Created` - Successful POST requests
- `204 No Content` - Successful DELETE requests
- `400 Bad Request` - Validation errors
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate resource (email, code)
- `422 Unprocessable Entity` - Business logic errors
- `500 Internal Server Error` - Server errors

## 🎯 Key Features Implemented

### ✅ **Data Access Layer (DAO)**
- Complete separation between business logic and data access
- Reusable and testable database operations
- Advanced querying capabilities
- Built-in error handling
- Type-safe operations

### ✅ **Response Standardization**
- Consistent response format across all endpoints
- Comprehensive error responses with field-level details
- Pagination metadata for list endpoints
- Success/failure indicators
- Timestamp tracking

### ✅ **Advanced Filtering**
- Full-text search across multiple fields
- Range queries (price, date)
- Boolean filters (inStock, hasPhone)
- Pagination with metadata
- Sorting capabilities

### ✅ **Validation Integration**
- Unique constraint checking
- Business rule validation
- Type-safe data transfer
- Comprehensive error messages

The implementation provides a solid foundation for scalable API development with clear separation of concerns, comprehensive error handling, and professional-grade response formatting. 🚀