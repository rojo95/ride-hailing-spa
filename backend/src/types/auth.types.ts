export interface RegisterRequest {
    email: string;
    password: string;
    secretQuestion: string;
    secretAnswer: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface ResetPasswordRequest {
    email: string;
    secretAnswer: string;
    newPassword: string;
}
