interface AuthenticatedRequestMember {
  id: string;
  role: string;
  isSuperAdmin: boolean;
  churchId: string;
}

declare namespace Express {
  export interface Request {
    member: AuthenticatedRequestMember;
    user: AuthenticatedRequestMember;
    userId: string;
    churchId?: string;
    role: string;
    isSuperAdmin: boolean;
  }
}
