export interface AppConfiguration {
  port: number;
  host: string;
}
export interface DatabaseConfiguration {
  name: string;
  username: string;
  host: string;
  port: number;
  password: string;
  ssl: boolean;
}
export interface JWTConfiguration {
  accessTokenAge: number;
  refreshTokenAge: number;
  accessSecretValue: string;
  refreshSecretValue: string;
}
export interface CoookieConfiguration {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  path: string;
}
