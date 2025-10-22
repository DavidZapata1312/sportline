import { Request, Response, NextFunction } from 'express';
import { ValidationRule, validate } from '../utils/validation.js';

export interface ValidationOptions {
    skipOnEmpty?: boolean;
    abortEarly?: boolean;
}

// Middleware factory for request validation
export function validateRequest(
    rules: ValidationRule[], 
    options: ValidationOptions = {}
) {
    return (req: Request, res: Response, next: NextFunction) => {
        const { skipOnEmpty = false, abortEarly = true } = options;
        
        // Skip validation if body is empty and skipOnEmpty is true
        if (skipOnEmpty && (!req.body || Object.keys(req.body).length === 0)) {
            return next();
        }
        
        const validationResult = validate(req.body, rules);
        
        if (!validationResult.isValid) {
            const errors = validationResult.getErrors();
            
            return res.status(400).json({
                error: 'Validation failed',
                message: abortEarly 
                    ? validationResult.getFirstError()?.message 
                    : 'Multiple validation errors',
                details: abortEarly 
                    ? [validationResult.getFirstError()] 
                    : errors,
                fields: errors.map(e => e.field)
            });
        }
        
        next();
    };
}

// Middleware factory for query parameter validation
export function validateQuery(rules: ValidationRule[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const validationResult = validate(req.query, rules);
        
        if (!validationResult.isValid) {
            const errors = validationResult.getErrors();
            
            return res.status(400).json({
                error: 'Query validation failed',
                message: validationResult.getFirstError()?.message,
                details: errors,
                fields: errors.map(e => e.field)
            });
        }
        
        next();
    };
}

// Middleware factory for path parameter validation
export function validateParams(rules: ValidationRule[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const validationResult = validate(req.params, rules);
        
        if (!validationResult.isValid) {
            const errors = validationResult.getErrors();
            
            return res.status(400).json({
                error: 'Parameter validation failed',
                message: validationResult.getFirstError()?.message,
                details: errors,
                fields: errors.map(e => e.field)
            });
        }
        
        next();
    };
}

// Common parameter validation rules
export const commonParamRules = {
    id: [
        { 
            field: 'id', 
            message: 'Invalid ID format', 
            validator: (value: any) => {
                const id = parseInt(value);
                return !isNaN(id) && id > 0;
            }
        }
    ]
};

// Pre-built validation middlewares
export const validations = {
    // Parameter validations
    validateId: validateParams(commonParamRules.id),
    
    // Client validations
    validateCreateClient: validateRequest([
        { field: 'name', message: 'Name is required', validator: (v) => v !== null && v !== undefined && v !== '' },
        { field: 'name', message: 'Name must be at least 2 characters', validator: (v) => !v || v.length >= 2 },
        { field: 'name', message: 'Name must not exceed 100 characters', validator: (v) => !v || v.length <= 100 },
        { field: 'email', message: 'Email is required', validator: (v) => v !== null && v !== undefined && v !== '' },
        { field: 'email', message: 'Invalid email format', validator: (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
        { field: 'email', message: 'Email must not exceed 100 characters', validator: (v) => !v || v.length <= 100 },
        { field: 'phone', message: 'Phone number must not exceed 20 characters', validator: (v) => !v || v.length <= 20 },
        { field: 'address', message: 'Address must not exceed 200 characters', validator: (v) => !v || v.length <= 200 },
    ]),
    
    validateUpdateClient: validateRequest([
        { field: 'name', message: 'Name must be at least 2 characters', validator: (v) => !v || v.length >= 2 },
        { field: 'name', message: 'Name must not exceed 100 characters', validator: (v) => !v || v.length <= 100 },
        { field: 'email', message: 'Invalid email format', validator: (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
        { field: 'email', message: 'Email must not exceed 100 characters', validator: (v) => !v || v.length <= 100 },
        { field: 'phone', message: 'Phone number must not exceed 20 characters', validator: (v) => !v || v.length <= 20 },
        { field: 'address', message: 'Address must not exceed 200 characters', validator: (v) => !v || v.length <= 200 },
    ], { skipOnEmpty: false }),
    
    // Product validations
    validateCreateProduct: validateRequest([
        { field: 'code', message: 'Product code is required', validator: (v) => v !== null && v !== undefined && v !== '' },
        { field: 'code', message: 'Product code must be alphanumeric', validator: (v) => !v || /^[a-zA-Z0-9-_]+$/.test(v) },
        { field: 'code', message: 'Product code must not exceed 50 characters', validator: (v) => !v || v.length <= 50 },
        { field: 'name', message: 'Product name is required', validator: (v) => v !== null && v !== undefined && v !== '' },
        { field: 'name', message: 'Product name must be at least 2 characters', validator: (v) => !v || v.length >= 2 },
        { field: 'name', message: 'Product name must not exceed 100 characters', validator: (v) => !v || v.length <= 100 },
        { field: 'price', message: 'Price is required', validator: (v) => v !== null && v !== undefined && v !== '' },
        { field: 'price', message: 'Price must be positive', validator: (v) => v === null || v === undefined || v > 0 },
        { field: 'category', message: 'Category is required', validator: (v) => v !== null && v !== undefined && v !== '' },
        { field: 'category', message: 'Category must not exceed 50 characters', validator: (v) => !v || v.length <= 50 },
        { field: 'stock', message: 'Stock must be non-negative', validator: (v) => v === null || v === undefined || v >= 0 },
    ]),
    
    validateUpdateProduct: validateRequest([
        { field: 'code', message: 'Product code must be alphanumeric', validator: (v) => !v || /^[a-zA-Z0-9-_]+$/.test(v) },
        { field: 'code', message: 'Product code must not exceed 50 characters', validator: (v) => !v || v.length <= 50 },
        { field: 'name', message: 'Product name must be at least 2 characters', validator: (v) => !v || v.length >= 2 },
        { field: 'name', message: 'Product name must not exceed 100 characters', validator: (v) => !v || v.length <= 100 },
        { field: 'price', message: 'Price must be positive', validator: (v) => v === null || v === undefined || v > 0 },
        { field: 'category', message: 'Category must not exceed 50 characters', validator: (v) => !v || v.length <= 50 },
        { field: 'stock', message: 'Stock must be non-negative', validator: (v) => v === null || v === undefined || v >= 0 },
    ], { skipOnEmpty: false })
};