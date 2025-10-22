// Base Response Schemas
export interface BaseResponse {
    success: boolean;
    message: string;
    timestamp: string;
}

export interface ErrorResponse extends BaseResponse {
    success: false;
    error: string;
    details?: any[];
    fields?: string[];
}

export interface SuccessResponse<T> extends BaseResponse {
    success: true;
    data: T;
}

export interface PaginatedResponse<T> extends SuccessResponse<T[]> {
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

// Client Response Schemas
export interface ClientResponse {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ClientListResponse extends PaginatedResponse<ClientResponse> {}

export interface SingleClientResponse extends SuccessResponse<ClientResponse> {}

// Product Response Schemas
export interface ProductResponse {
    id: number;
    code: string;
    name: string;
    description?: string;
    price: number;
    category: string;
    stock: number;
    createdAt: string;
    updatedAt: string;
}

export interface ProductListResponse extends PaginatedResponse<ProductResponse> {}

export interface SingleProductResponse extends SuccessResponse<ProductResponse> {}

// Auth Response Schemas
export interface AuthResponse extends SuccessResponse<{
    user: {
        id: number;
        username: string;
        email: string;
        role: 'admin' | 'staff';
        createdAt: string;
        updatedAt: string;
    };
    accessToken: string;
    refreshToken: string;
}> {}

export interface TokenRefreshResponse extends SuccessResponse<{
    accessToken: string;
    refreshToken: string;
}> {}

// Statistics Response Schemas
export interface DashboardStatsResponse extends SuccessResponse<{
    clients: {
        total: number;
        recent: number;
        withPhone: number;
        withAddress: number;
    };
    products: {
        total: number;
        inStock: number;
        outOfStock: number;
        categories: string[];
    };
    system: {
        uptime: string;
        version: string;
        environment: string;
    };
}> {}

// Example Responses for Documentation
export const ResponseExamples = {
    // Client Examples
    client: {
        single: {
            success: true,
            message: "Client retrieved successfully",
            timestamp: "2024-01-15T10:30:00.000Z",
            data: {
                id: 1,
                name: "Juan Pérez",
                email: "juan.perez@email.com",
                phone: "+1234567890",
                address: "123 Main St, City, Country",
                createdAt: "2024-01-15T10:30:00.000Z",
                updatedAt: "2024-01-15T10:30:00.000Z"
            }
        } as SingleClientResponse,

        list: {
            success: true,
            message: "Clients retrieved successfully",
            timestamp: "2024-01-15T10:30:00.000Z",
            data: [
                {
                    id: 1,
                    name: "Juan Pérez",
                    email: "juan.perez@email.com",
                    phone: "+1234567890",
                    address: "123 Main St, City, Country",
                    createdAt: "2024-01-15T10:30:00.000Z",
                    updatedAt: "2024-01-15T10:30:00.000Z"
                },
                {
                    id: 2,
                    name: "María González",
                    email: "maria.gonzalez@email.com",
                    phone: "+0987654321",
                    address: "456 Oak Ave, City, Country",
                    createdAt: "2024-01-15T09:15:00.000Z",
                    updatedAt: "2024-01-15T09:15:00.000Z"
                }
            ],
            pagination: {
                total: 25,
                page: 1,
                limit: 10,
                totalPages: 3,
                hasNext: true,
                hasPrev: false
            }
        } as ClientListResponse,

        created: {
            success: true,
            message: "Client created successfully",
            timestamp: "2024-01-15T10:30:00.000Z",
            data: {
                id: 3,
                name: "Carlos Rodriguez",
                email: "carlos.rodriguez@email.com",
                phone: "+1122334455",
                address: undefined,
                createdAt: "2024-01-15T10:30:00.000Z",
                updatedAt: "2024-01-15T10:30:00.000Z"
            }
        } as SingleClientResponse
    },

    // Product Examples
    product: {
        single: {
            success: true,
            message: "Product retrieved successfully",
            timestamp: "2024-01-15T10:30:00.000Z",
            data: {
                id: 1,
                code: "NIKE-FB001",
                name: "Balón de fútbol Nike",
                description: "Balón oficial de la liga, tamaño 5",
                price: 49.99,
                category: "Fútbol",
                stock: 10,
                createdAt: "2024-01-15T10:30:00.000Z",
                updatedAt: "2024-01-15T10:30:00.000Z"
            }
        } as SingleProductResponse,

        list: {
            success: true,
            message: "Products retrieved successfully",
            timestamp: "2024-01-15T10:30:00.000Z",
            data: [
                {
                    id: 1,
                    code: "NIKE-FB001",
                    name: "Balón de fútbol Nike",
                    description: "Balón oficial de la liga, tamaño 5",
                    price: 49.99,
                    category: "Fútbol",
                    stock: 10,
                    createdAt: "2024-01-15T10:30:00.000Z",
                    updatedAt: "2024-01-15T10:30:00.000Z"
                },
                {
                    id: 2,
                    code: "ADIDAS-RUN001",
                    name: "Camiseta Adidas Running",
                    description: "Camiseta ligera para correr",
                    price: 29.99,
                    category: "Running",
                    stock: 20,
                    createdAt: "2024-01-15T09:15:00.000Z",
                    updatedAt: "2024-01-15T09:15:00.000Z"
                }
            ],
            pagination: {
                total: 50,
                page: 1,
                limit: 10,
                totalPages: 5,
                hasNext: true,
                hasPrev: false
            }
        } as ProductListResponse,

        created: {
            success: true,
            message: "Product created successfully",
            timestamp: "2024-01-15T10:30:00.000Z",
            data: {
                id: 3,
                code: "WILSON-TNS001",
                name: "Raqueta de tenis Wilson",
                description: "Raqueta profesional, marco de carbono",
                price: 120.0,
                category: "Tenis",
                stock: 5,
                createdAt: "2024-01-15T10:30:00.000Z",
                updatedAt: "2024-01-15T10:30:00.000Z"
            }
        } as SingleProductResponse
    },

    // Auth Examples
    auth: {
        login: {
            success: true,
            message: "Login successful",
            timestamp: "2024-01-15T10:30:00.000Z",
            data: {
                user: {
                    id: 1,
                    username: "admin",
                    email: "admin@sportline.com",
                    role: "admin" as const,
                    createdAt: "2024-01-15T10:30:00.000Z",
                    updatedAt: "2024-01-15T10:30:00.000Z"
                },
                accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            }
        } as AuthResponse,

        refresh: {
            success: true,
            message: "Tokens refreshed successfully",
            timestamp: "2024-01-15T10:30:00.000Z",
            data: {
                accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            }
        } as TokenRefreshResponse
    },

    // Error Examples
    errors: {
        validation: {
            success: false,
            message: "Validation failed",
            timestamp: "2024-01-15T10:30:00.000Z",
            error: "Validation failed",
            details: [
                {
                    field: "email",
                    message: "Invalid email format",
                    value: "invalid-email"
                }
            ],
            fields: ["email"]
        } as ErrorResponse,

        notFound: {
            success: false,
            message: "Resource not found",
            timestamp: "2024-01-15T10:30:00.000Z",
            error: "Client not found"
        } as ErrorResponse,

        conflict: {
            success: false,
            message: "Resource already exists",
            timestamp: "2024-01-15T10:30:00.000Z",
            error: "Email already exists",
            details: ["Client with email 'test@example.com' already exists"]
        } as ErrorResponse,

        unauthorized: {
            success: false,
            message: "Authentication required",
            timestamp: "2024-01-15T10:30:00.000Z",
            error: "Access token required"
        } as ErrorResponse,

        forbidden: {
            success: false,
            message: "Insufficient permissions",
            timestamp: "2024-01-15T10:30:00.000Z",
            error: "Admin access required"
        } as ErrorResponse,

        serverError: {
            success: false,
            message: "Internal server error",
            timestamp: "2024-01-15T10:30:00.000Z",
            error: "Something went wrong"
        } as ErrorResponse
    },

    // Statistics Example
    stats: {
        dashboard: {
            success: true,
            message: "Dashboard statistics retrieved successfully",
            timestamp: "2024-01-15T10:30:00.000Z",
            data: {
                clients: {
                    total: 156,
                    recent: 12,
                    withPhone: 134,
                    withAddress: 98
                },
                products: {
                    total: 234,
                    inStock: 198,
                    outOfStock: 36,
                    categories: ["Fútbol", "Running", "Tenis", "Basketball", "Swimming"]
                },
                system: {
                    uptime: "5 days, 14 hours, 23 minutes",
                    version: "1.0.0",
                    environment: "production"
                }
            }
        } as DashboardStatsResponse
    }
};

// HTTP Status Code Mappings
export const HttpStatusCodes = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500
} as const;

// Common Error Messages
export const ErrorMessages = {
    VALIDATION_FAILED: "Validation failed",
    RESOURCE_NOT_FOUND: "Resource not found",
    RESOURCE_ALREADY_EXISTS: "Resource already exists",
    UNAUTHORIZED: "Authentication required",
    FORBIDDEN: "Insufficient permissions",
    INTERNAL_ERROR: "Internal server error",
    INVALID_CREDENTIALS: "Invalid credentials",
    TOKEN_EXPIRED: "Token has expired",
    INVALID_TOKEN: "Invalid token"
} as const;