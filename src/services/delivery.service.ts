import { DeliveryDAO, CreateDeliveryData } from '../dao/delivery.dao.js';

export class DeliveryService {
    private deliveryDAO: DeliveryDAO;

    constructor() {
        this.deliveryDAO = new DeliveryDAO();
    }

    async create(data: CreateDeliveryData) {
        return this.deliveryDAO.createDelivery(data);
    }

    async getClientHistory(clientId: number, page: number = 1, limit: number = 10) {
        return this.deliveryDAO.getClientHistory(clientId, page, limit);
    }
}
