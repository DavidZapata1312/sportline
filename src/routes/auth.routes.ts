import { Router, Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { RegisterDTO, LoginDTO } from '../dtos/auth.dto.js';

const router = Router();
const authService = new AuthService();

// Register endpoint
router.post('/register', async (req: Request, res: Response) => {
    try {
        const registerData: RegisterDTO = req.body;
        
        // Basic validation
        if (!registerData.name || !registerData.email || !registerData.password) {
            return res.status(400).json({ 
                error: 'Name, email, and password are required' 
            });
        }

        const user = await authService.register(registerData);
        
        // Don't send password in response
        const { password, ...userWithoutPassword } = user.toJSON();
        
        res.status(201).json({
            message: 'User registered successfully',
            user: userWithoutPassword
        });
    } catch (error: any) {
        res.status(400).json({ 
            error: error.message || 'Registration failed' 
        });
    }
});

// Login endpoint
router.post('/login', async (req: Request, res: Response) => {
    try {
        const loginData: LoginDTO = req.body;
        
        // Basic validation
        if (!loginData.email || !loginData.password) {
            return res.status(400).json({ 
                error: 'Email and password are required' 
            });
        }

        const { user, accessToken, refreshToken } = await authService.login(loginData);
        
        // Don't send password in response
        const { password, ...userWithoutPassword } = user.toJSON();
        
        res.json({
            message: 'Login successful',
            user: userWithoutPassword,
            accessToken,
            refreshToken
        });
    } catch (error: any) {
        res.status(401).json({ 
            error: error.message || 'Login failed' 
        });
    }
});

// Refresh token endpoint
router.post('/refresh', async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;
        
        // Basic validation
        if (!refreshToken) {
            return res.status(400).json({ 
                error: 'Refresh token is required' 
            });
        }

        const tokens = await authService.refreshTokens(refreshToken);
        
        res.json({
            message: 'Tokens refreshed successfully',
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        });
    } catch (error: any) {
        res.status(403).json({ 
            error: error.message || 'Invalid refresh token' 
        });
    }
});

export default router;
