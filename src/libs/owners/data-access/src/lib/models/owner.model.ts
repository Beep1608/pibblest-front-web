export interface RegisterOwnerDto{
    company: string;
    name: string;
    lastName: string;
    email: string;
    password: string
}

export interface OwnerRegisterResponse{
    message: string;
    token: string;
}

export interface LoginOwnerDto{
    email:  string;
    password?: string;
}

export interface LoginOwnerResponse{
    message: string;
    token: string;
}