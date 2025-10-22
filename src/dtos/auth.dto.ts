export interface RegisterDTO {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'staff';
}

export interface LoginDTO {
    email: string;
    password: string;
}
