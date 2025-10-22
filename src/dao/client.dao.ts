import Client from '../models/client.model.js';
import { CreateClientDTO, UpdateClientDTO } from '../dtos/client.dto.js';
import { WhereOptions, Op } from 'sequelize';

export interface ClientCreateData {
    name: string;
    email: string;
    phone?: string;
    address?: string;
}

export interface ClientUpdateData {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
}

export interface ClientFilter {
    id?: number;
    name?: string;
    email?: string;
    phone?: string;
    search?: string;
}

export interface PaginationOptions {
    page?: number;
    limit?: number;
}

export interface ClientQueryResult {
    clients: Client[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export class ClientDAO {

    /**
     * Create a new client
     */
    async create(clientData: ClientCreateData): Promise<Client> {
        try {
            return await Client.create(clientData);
        } catch (error: any) {
            throw new Error(`Failed to create client: ${error.message}`);
        }
    }

    /**
     * Find client by ID
     */
    async findById(id: number): Promise<Client | null> {
        try {
            return await Client.findByPk(id);
        } catch (error: any) {
            throw new Error(`Failed to find client by ID: ${error.message}`);
        }
    }

    /**
     * Find client by email
     */
    async findByEmail(email: string): Promise<Client | null> {
        try {
            return await Client.findOne({ where: { email } });
        } catch (error: any) {
            throw new Error(`Failed to find client by email: ${error.message}`);
        }
    }

    /**
     * Find all clients with optional filters and pagination
     */
    async findAll(
        filter: ClientFilter = {},
        pagination: PaginationOptions = {}
    ): Promise<ClientQueryResult> {
        try {
            const { page = 1, limit = 10 } = pagination;
            const offset = (page - 1) * limit;
            
            const whereClause = this.buildWhereClause(filter);
            
            const { rows: clients, count: total } = await Client.findAndCountAll({
                where: whereClause,
                limit,
                offset,
                order: [['createdAt', 'DESC']]
            });

            const totalPages = Math.ceil(total / limit);

            return {
                clients,
                total,
                page,
                limit,
                totalPages
            };
        } catch (error: any) {
            throw new Error(`Failed to find clients: ${error.message}`);
        }
    }

    /**
     * Update client by ID
     */
    async update(id: number, updateData: ClientUpdateData): Promise<Client | null> {
        try {
            const client = await Client.findByPk(id);
            if (!client) {
                return null;
            }
            
            await client.update(updateData);
            return client;
        } catch (error: any) {
            throw new Error(`Failed to update client: ${error.message}`);
        }
    }

    /**
     * Delete client by ID
     */
    async delete(id: number): Promise<boolean> {
        try {
            const client = await Client.findByPk(id);
            if (!client) {
                return false;
            }
            
            await client.destroy();
            return true;
        } catch (error: any) {
            throw new Error(`Failed to delete client: ${error.message}`);
        }
    }

    /**
     * Check if email already exists
     */
    async emailExists(email: string, excludeId?: number): Promise<boolean> {
        try {
            const whereClause: WhereOptions = { email };
            if (excludeId) {
                whereClause.id = { [Op.ne]: excludeId };
            }
            
            const client = await Client.findOne({ where: whereClause });
            return !!client;
        } catch (error: any) {
            throw new Error(`Failed to check email existence: ${error.message}`);
        }
    }

    /**
     * Search clients by name, email, or phone
     */
    async search(query: string, pagination: PaginationOptions = {}): Promise<ClientQueryResult> {
        return this.findAll({ search: query }, pagination);
    }

    /**
     * Get clients with phone numbers
     */
    async findWithPhone(pagination: PaginationOptions = {}): Promise<ClientQueryResult> {
        try {
            const { page = 1, limit = 10 } = pagination;
            const offset = (page - 1) * limit;
            
            const { rows: clients, count: total } = await Client.findAndCountAll({
                where: {
                    phone: { [Op.ne]: null as any }
                },
                limit,
                offset,
                order: [['createdAt', 'DESC']]
            });

            const totalPages = Math.ceil(total / limit);

            return {
                clients,
                total,
                page,
                limit,
                totalPages
            };
        } catch (error: any) {
            throw new Error(`Failed to find clients with phone: ${error.message}`);
        }
    }

    /**
     * Get clients with addresses
     */
    async findWithAddress(pagination: PaginationOptions = {}): Promise<ClientQueryResult> {
        try {
            const { page = 1, limit = 10 } = pagination;
            const offset = (page - 1) * limit;
            
            const { rows: clients, count: total } = await Client.findAndCountAll({
                where: {
                    address: { [Op.ne]: null as any }
                },
                limit,
                offset,
                order: [['createdAt', 'DESC']]
            });

            const totalPages = Math.ceil(total / limit);

            return {
                clients,
                total,
                page,
                limit,
                totalPages
            };
        } catch (error: any) {
            throw new Error(`Failed to find clients with address: ${error.message}`);
        }
    }

    /**
     * Count total clients
     */
    async count(filter: ClientFilter = {}): Promise<number> {
        try {
            const whereClause = this.buildWhereClause(filter);
            return await Client.count({ where: whereClause });
        } catch (error: any) {
            throw new Error(`Failed to count clients: ${error.message}`);
        }
    }

    /**
     * Get recently created clients
     */
    async findRecent(days: number = 7, pagination: PaginationOptions = {}): Promise<ClientQueryResult> {
        try {
            const { page = 1, limit = 10 } = pagination;
            const offset = (page - 1) * limit;
            
            const dateThreshold = new Date();
            dateThreshold.setDate(dateThreshold.getDate() - days);
            
            const { rows: clients, count: total } = await Client.findAndCountAll({
                where: {
                    createdAt: { [Op.gte]: dateThreshold }
                },
                limit,
                offset,
                order: [['createdAt', 'DESC']]
            });

            const totalPages = Math.ceil(total / limit);

            return {
                clients,
                total,
                page,
                limit,
                totalPages
            };
        } catch (error: any) {
            throw new Error(`Failed to find recent clients: ${error.message}`);
        }
    }

    /**
     * Find clients by partial name match
     */
    async findByName(name: string, pagination: PaginationOptions = {}): Promise<ClientQueryResult> {
        return this.findAll({ name }, pagination);
    }

    /**
     * Bulk create clients
     */
    async bulkCreate(clientsData: ClientCreateData[]): Promise<Client[]> {
        try {
            return await Client.bulkCreate(clientsData);
        } catch (error: any) {
            throw new Error(`Failed to bulk create clients: ${error.message}`);
        }
    }

    /**
     * Build WHERE clause for filtering
     */
    private buildWhereClause(filter: ClientFilter): WhereOptions {
        const where: WhereOptions = {};

        if (filter.id) {
            where.id = filter.id;
        }

        if (filter.name) {
            where.name = { [Op.iLike]: `%${filter.name}%` };
        }

        if (filter.email) {
            where.email = { [Op.iLike]: `%${filter.email}%` };
        }

        if (filter.phone) {
            where.phone = { [Op.iLike]: `%${filter.phone}%` };
        }

        if (filter.search) {
            (where as any)[Op.or] = [
                { name: { [Op.iLike]: `%${filter.search}%` } },
                { email: { [Op.iLike]: `%${filter.search}%` } },
                { phone: { [Op.iLike]: `%${filter.search}%` } },
                { address: { [Op.iLike]: `%${filter.search}%` } }
            ];
        }

        return where;
    }
}