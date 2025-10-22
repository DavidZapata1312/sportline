export interface ValidationRule {
    field: string;
    message: string;
    validator: (value: any) => boolean;
}

export interface ValidationError {
    field: string;
    message: string;
    value?: any;
}

export class ValidationResult {
    public errors: ValidationError[] = [];
    
    get isValid(): boolean {
        return this.errors.length === 0;
    }
    
    addError(field: string, message: string, value?: any): void {
        this.errors.push({ field, message, value });
    }
    
    getErrors(): ValidationError[] {
        return this.errors;
    }
    
    getFirstError(): ValidationError | null {
        return this.errors.length > 0 ? this.errors[0] : null;
    }
}

// Common validation functions
export const validators = {
    required: (value: any): boolean => {
        return value !== null && value !== undefined && value !== '';
    },
    
    email: (value: string): boolean => {
        if (!value) return true; // Allow empty if not required
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    },
    
    minLength: (min: number) => (value: string): boolean => {
        if (!value) return true; // Allow empty if not required
        return value.length >= min;
    },
    
    maxLength: (max: number) => (value: string): boolean => {
        if (!value) return true; // Allow empty if not required
        return value.length <= max;
    },
    
    minValue: (min: number) => (value: number): boolean => {
        if (value === null || value === undefined) return true;
        return value >= min;
    },
    
    maxValue: (max: number) => (value: number): boolean => {
        if (value === null || value === undefined) return true;
        return value <= max;
    },
    
    positive: (value: number): boolean => {
        if (value === null || value === undefined) return true;
        return value > 0;
    },
    
    nonNegative: (value: number): boolean => {
        if (value === null || value === undefined) return true;
        return value >= 0;
    },
    
    alphanumeric: (value: string): boolean => {
        if (!value) return true;
        const alphanumericRegex = /^[a-zA-Z0-9-_]+$/;
        return alphanumericRegex.test(value);
    },
    
    phone: (value: string): boolean => {
        if (!value) return true;
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''));
    },
    
    oneOf: (options: any[]) => (value: any): boolean => {
        if (value === null || value === undefined) return true;
        return options.includes(value);
    }
};

// Generic validator function
export function validate(data: any, rules: ValidationRule[]): ValidationResult {
    const result = new ValidationResult();
    
    rules.forEach(rule => {
        const value = data[rule.field];
        if (!rule.validator(value)) {
            result.addError(rule.field, rule.message, value);
        }
    });
    
    return result;
}

// Specific validation schemas
export const clientValidationRules = {
    create: [
        { field: 'name', message: 'Name is required', validator: validators.required },
        { field: 'name', message: 'Name must be at least 2 characters', validator: validators.minLength(2) },
        { field: 'name', message: 'Name must not exceed 100 characters', validator: validators.maxLength(100) },
        { field: 'email', message: 'Email is required', validator: validators.required },
        { field: 'email', message: 'Invalid email format', validator: validators.email },
        { field: 'email', message: 'Email must not exceed 100 characters', validator: validators.maxLength(100) },
        { field: 'phone', message: 'Invalid phone number format', validator: validators.phone },
        { field: 'phone', message: 'Phone number must not exceed 20 characters', validator: validators.maxLength(20) },
        { field: 'address', message: 'Address must not exceed 200 characters', validator: validators.maxLength(200) },
    ],
    
    update: [
        { field: 'name', message: 'Name must be at least 2 characters', validator: validators.minLength(2) },
        { field: 'name', message: 'Name must not exceed 100 characters', validator: validators.maxLength(100) },
        { field: 'email', message: 'Invalid email format', validator: validators.email },
        { field: 'email', message: 'Email must not exceed 100 characters', validator: validators.maxLength(100) },
        { field: 'phone', message: 'Invalid phone number format', validator: validators.phone },
        { field: 'phone', message: 'Phone number must not exceed 20 characters', validator: validators.maxLength(20) },
        { field: 'address', message: 'Address must not exceed 200 characters', validator: validators.maxLength(200) },
    ]
};

export const productValidationRules = {
    create: [
        { field: 'code', message: 'Product code is required', validator: validators.required },
        { field: 'code', message: 'Product code must be alphanumeric', validator: validators.alphanumeric },
        { field: 'code', message: 'Product code must not exceed 50 characters', validator: validators.maxLength(50) },
        { field: 'name', message: 'Product name is required', validator: validators.required },
        { field: 'name', message: 'Product name must be at least 2 characters', validator: validators.minLength(2) },
        { field: 'name', message: 'Product name must not exceed 100 characters', validator: validators.maxLength(100) },
        { field: 'price', message: 'Price is required', validator: validators.required },
        { field: 'price', message: 'Price must be positive', validator: validators.positive },
        { field: 'category', message: 'Category is required', validator: validators.required },
        { field: 'category', message: 'Category must not exceed 50 characters', validator: validators.maxLength(50) },
        { field: 'stock', message: 'Stock must be non-negative', validator: validators.nonNegative },
    ],
    
    update: [
        { field: 'code', message: 'Product code must be alphanumeric', validator: validators.alphanumeric },
        { field: 'code', message: 'Product code must not exceed 50 characters', validator: validators.maxLength(50) },
        { field: 'name', message: 'Product name must be at least 2 characters', validator: validators.minLength(2) },
        { field: 'name', message: 'Product name must not exceed 100 characters', validator: validators.maxLength(100) },
        { field: 'price', message: 'Price must be positive', validator: validators.positive },
        { field: 'category', message: 'Category must not exceed 50 characters', validator: validators.maxLength(50) },
        { field: 'stock', message: 'Stock must be non-negative', validator: validators.nonNegative },
    ]
};