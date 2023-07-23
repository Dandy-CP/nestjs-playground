export interface LoginResponse {
  id: string;
  email: string;
  isVerified: boolean;
  access_token: string;
  refresh_token: string;
}
