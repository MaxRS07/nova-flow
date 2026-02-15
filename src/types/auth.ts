export interface AuthResponse {
    message: string;
    user?: any;
    session?: any;
    error?: string;
}

export interface SignupParams {
    email: string;
    password: string;
    name?: string;
}

export interface LoginParams {
    email: string;
    password: string;
}
