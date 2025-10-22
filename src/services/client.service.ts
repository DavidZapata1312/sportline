import { ClientDAO, ClientCreateData, ClientUpdateData, ClientQueryResult } from '../dao/client.dao.js';
import Client from '../models/client.model.js';

export class ClientService {
    private clientDAO: ClientDAO;

    constructor() {
        this.clientDAO = new ClientDAO();
    }

    async create(data: ClientCreateData): Promise<Client> {
        const exists = await this.clientDAO.emailExists(data.email);
        if (exists) throw new Error('Email already exists');
        return this.clientDAO.create(data);
    }

    async getById(id: number): Promise<Client | null> {
        return this.clientDAO.findById(id);
    }

    async list(filter: any = {}, pagination: any = {}): Promise<ClientQueryResult> {
        return this.clientDAO.findAll(filter, pagination);
    }

    async update(id: number, data: ClientUpdateData): Promise<Client | null> {
        if (data.email) {
            const exists = await this.clientDAO.emailExists(data.email, id);
            if (exists) throw new Error('Email already exists');
        }
        return this.clientDAO.update(id, data);
    }

    async remove(id: number): Promise<boolean> {
        return this.clientDAO.delete(id);
    }
}
