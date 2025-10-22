import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export class AuthController {
    async register(req: Request, res: Response) {
        try {
            const user = await authService.register(req.body);
            res.status(201).json(user);
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { user, accessToken, refreshToken } = await authService.login(req.body);
            res.json({ user, accessToken, refreshToken });
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }

    async refresh(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.status(400).json({ message: 'Refresh token is required' });
            }
            const tokens = await authService.refreshTokens(refreshToken);
            res.json(tokens);
        } catch (err: any) {
            res.status(403).json({ message: err.message });
        }
    }
}
