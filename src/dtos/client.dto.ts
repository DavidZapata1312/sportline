export interface CreateClientDTO {
    name: string;
    email: string;
    phone?: string;
    address?: string;
}

export interface UpdateClientDTO {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
}

export interface ClientResponseDTO {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ClientListResponseDTO {
    message: string;
    data: ClientResponseDTO[];
    total?: number;
    page?: number;
    limit?: number;
}