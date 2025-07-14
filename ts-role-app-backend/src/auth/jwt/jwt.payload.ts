export interface JwtPayload {
  sub: string; // user ID
  role: 'admin' | 'user';
  isBlocked: boolean;
}
