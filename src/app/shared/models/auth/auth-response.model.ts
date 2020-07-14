export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  authorities?: [];
  expires_in?: number;
}
