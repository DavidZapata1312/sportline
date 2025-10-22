import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';

export interface AuthRequest extends Request {
    user?: {
        id: number;
        role: string;
    };
}

// Middleware to verify JWT access token
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ 
            error: 'Access token required',
            message: 'Please provide a valid access token in Authorization header' 
        });
    }

    try {
        const payload = verifyAccessToken(token) as any;
        req.user = { id: payload.id, role: payload.role };
        next();
    } catch (error) {
        return res.status(403).json({ 
            error: 'Invalid or expired access token',
            message: 'Please refresh your token or login again' 
        });
    }
};

// Middleware to check if user is admin
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({ 
            error: 'Authentication required' 
        });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ 
            error: 'Admin access required',
            message: 'You need admin privileges to access this resource' 
        });
    }

    next();
};

// Middleware to check if user is admin or staff
export const requireStaffOrAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({ 
            error: 'Authentication required' 
        });
    }

    if (!['admin', 'staff'].includes(req.user.role)) {
        return res.status(403).json({ 
            error: 'Staff or admin access required',
            message: 'You need staff or admin privileges to access this resource' 
        });
    }

    next();
};