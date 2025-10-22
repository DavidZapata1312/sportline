import {RegisterDTO, LoginDTO} from "../dtos/auth.dto.js";
import User from "../models/user.model.js";
import {hashPassword, comparePassword} from "../utils/hash.js";
import {generateAccessToken, generateRefreshToken, verifyRefreshToken} from "../utils/jwt.js";
import {UserDAO} from "../dao/user.dao.js";

export class AuthService {
    private userDAO: UserDAO;

    constructor() {
        this.userDAO = new UserDAO();
    }

    async register(data: RegisterDTO): Promise<User> {
        // Check if email already exists using DAO
        const emailExists = await this.userDAO.emailExists(data.email);
        if (emailExists) throw new Error('Email already exists');

        const hashedPassword = await hashPassword(data.password);

        const user = await this.userDAO.create({
            username: data.name,
            email: data.email,
            password: hashedPassword,
            role: data.role
        });

        return user;
    }

    async login(data: LoginDTO): Promise<{ user: User; accessToken: string; refreshToken: string }> {
        const user = await this.userDAO.findByEmail(data.email);
        if (!user) throw new Error('Invalid credentials');

        const isValid = await comparePassword(data.password, user.password);
        if (!isValid) throw new Error('Invalid credentials');

        const accessToken = generateAccessToken({ id: user.id, role: user.role });
        const refreshToken = generateRefreshToken({ id: user.id, role: user.role });
        return { user, accessToken, refreshToken };
    }

    async refreshTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
        try {
            const payload = verifyRefreshToken(refreshToken) as any;
            
            // Verify user still exists using DAO
            const user = await this.userDAO.findById(payload.id);
            if (!user) throw new Error('User not found');
            
            const newAccessToken = generateAccessToken({ id: payload.id, role: payload.role });
            const newRefreshToken = generateRefreshToken({ id: payload.id, role: payload.role });
            
            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }
}
