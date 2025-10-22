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

export interface RefreshTokenDTO {
    refreshToken: string;
}

export interface AuthResponseDTO {
    user: {
        id: number;
        username: string;
        email: string;
        role: 'admin' | 'staff';
        createdAt: Date;
        updatedAt: Date;
    };
    accessToken: string;
    refreshToken: string;
}

export interface TokenResponseDTO {
    accessToken: string;
    refreshToken: string;
}

export interface UserResponseDTO {
    id: number;
    username: string;
    email: string;
    role: 'admin' | 'staff';
    createdAt: Date;
    updatedAt: Date;
}
