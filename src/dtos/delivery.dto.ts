export interface DeliveryItemInputDTO {
    productId: number;
    quantity: number;
}

export interface CreateDeliveryDTO {
    clientId: number;
    items: DeliveryItemInputDTO[];
    notes?: string;
}

export interface DeliveryItemResponseDTO {
    id: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    product?: {
        id: number;
        code: string;
        name: string;
    };
}

export interface DeliveryResponseDTO {
    id: number;
    clientId: number;
    totalAmount: number;
    notes?: string;
    createdAt: Date;
    items: DeliveryItemResponseDTO[];
}
