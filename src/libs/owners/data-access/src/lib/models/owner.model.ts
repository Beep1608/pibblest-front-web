export interface RegisterOwnerDto{
    company: string;
    name: string;
    lastName: string;
    email: string;
    password: string
}

export interface OwnerRegisterResponse{
    id: string;
    message: string;
}