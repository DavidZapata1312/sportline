export interface OrderItemInputDTO {
    productId: number;
    quantity: number;
}

export interface CreateOrderDTO {
    clientId: number;
    items: OrderItemInputDTO[];
}

export interface OrderFilterDTO {
    clientId?: number;
    productId?: number;
    page?: number;
    limit?: number;
}
