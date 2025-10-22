import User from '../models/user.model.js';
import { RegisterDTO } from '../dtos/auth.dto.js';
import { WhereOptions } from 'sequelize';

export interface CreateUserData {
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'staff';
}

export interface UpdateUserData {
    username?: string;
    email?: string;
    password?: string;
    role?: 'admin' | 'staff';
}

export interface UserFilter {
    id?: number;
    email?: string;
    username?: string;
    role?: 'admin' | 'staff';
}

export class UserDAO {
    
    /**
     * Create a new user
     */
    async create(userData: CreateUserData): Promise<User> {
        try {
            const user = await User.create(userData);
            return user;
        } catch (error: any) {
            throw new Error(`Failed to create user: ${error.message}`);
        }
    }

    /**
     * Find user by ID
     */
    async findById(id: number): Promise<User | null> {
        try {
            return await User.findByPk(id);
        } catch (error: any) {
            throw new Error(`Failed to find user by ID: ${error.message}`);
        }
    }

    /**
     * Find user by email
     */
    async findByEmail(email: string): Promise<User | null> {
        try {
            return await User.findOne({ where: { email } });
        } catch (error: any) {
            throw new Error(`Failed to find user by email: ${error.message}`);
        }
    }

    /**
     * Find user by username
     */
    async findByUsername(username: string): Promise<User | null> {
        try {
            return await User.findOne({ where: { username } });
        } catch (error: any) {
            throw new Error(`Failed to find user by username: ${error.message}`);
        }
    }

    /**
     * Find user with filters
     */
    async findOne(filter: UserFilter): Promise<User | null> {
        try {
            return await User.findOne({ where: filter as WhereOptions });
        } catch (error: any) {
            throw new Error(`Failed to find user: ${error.message}`);
        }
    }

    /**
     * Find all users with optional filters
     */
    async findAll(filter?: UserFilter): Promise<User[]> {
        try {
            const whereClause = filter ? { where: filter as WhereOptions } : {};
            return await User.findAll(whereClause);
        } catch (error: any) {
            throw new Error(`Failed to find users: ${error.message}`);
        }
    }

    /**
     * Update user by ID
     */
    async update(id: number, updateData: UpdateUserData): Promise<User | null> {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                return null;
            }
            
            await user.update(updateData);
            return user;
        } catch (error: any) {
            throw new Error(`Failed to update user: ${error.message}`);
        }
    }

    /**
     * Delete user by ID
     */
    async delete(id: number): Promise<boolean> {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                return false;
            }
            
            await user.destroy();
            return true;
        } catch (error: any) {
            throw new Error(`Failed to delete user: ${error.message}`);
        }
    }

    /**
     * Check if email already exists
     */
    async emailExists(email: string): Promise<boolean> {
        try {
            const user = await User.findOne({ where: { email } });
            return !!user;
        } catch (error: any) {
            throw new Error(`Failed to check email existence: ${error.message}`);
        }
    }

    /**
     * Check if username already exists
     */
    async usernameExists(username: string): Promise<boolean> {
        try {
            const user = await User.findOne({ where: { username } });
            return !!user;
        } catch (error: any) {
            throw new Error(`Failed to check username existence: ${error.message}`);
        }
    }

    /**
     * Get users by role
     */
    async findByRole(role: 'admin' | 'staff'): Promise<User[]> {
        try {
            return await User.findAll({ where: { role } });
        } catch (error: any) {
            throw new Error(`Failed to find users by role: ${error.message}`);
        }
    }

    /**
     * Count total users
     */
    async count(filter?: UserFilter): Promise<number> {
        try {
            const whereClause = filter ? { where: filter as WhereOptions } : {};
            return await User.count(whereClause);
        } catch (error: any) {
            throw new Error(`Failed to count users: ${error.message}`);
        }
    }
}