declare namespace Express {
    export interface Request {
        member: {
            id: string;
            role: string;
            isSuperAdmin: boolean;
        };
    }
}
