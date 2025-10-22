import {RegisterDTO, LoginDTO} from "../dtos/auth.dto.js";
import User from "../models/user.model.js";
import {hashPassword, comparePassword} from "../utils/hash.js";
import {generateToken} from "../utils/jwt.js";

export class AuthService {
    async register(data: RegisterDTO): Promise<User> {
        const existingUser = await User.findOne({ where: { email: data.email } });
        if (existingUser) throw new Error('Email already exists');

        const hashedPassword = await hashPassword(data.password);

        const user = await User.create({
            username: data.name,
            email: data.email,
            password: hashedPassword,
            role: data.role
        });

        return user;
    }

    async login(data: LoginDTO): Promise<{ user: User; token: string }> {
        const user = await User.findOne({ where: { email: data.email } });
        if (!user) throw new Error('Invalid credentials');

        const isValid = await comparePassword(data.password, user.password);
        if (!isValid) throw new Error('Invalid credentials');

        const token = generateToken({ id: user.id, role: user.role });
        return { user, token };
    }
}
