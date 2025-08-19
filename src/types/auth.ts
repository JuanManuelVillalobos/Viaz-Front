// JWT Token Management Types
export interface UserAuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: Array<{
      name: string;
      displayName: string;
      description: string;
      permissions: string[];
    }>;
  };
  effectivePermissions: string[];
  sessionInfo: {
    expiresAt: string;
    lastLogin: string;
    isActive: boolean;
  };
  tokenInfo: {
    tokenType: string;
    expiresIn: number;
    issuedAt: string;
  };
}

export interface LoginResponse {
  accessToken: string;
  username: string;
}

export interface RefreshResponse {
  accessToken: string;
  username: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface TokenService {
  setTokens(accessToken: string, refreshToken?: string): void;
  getAccessToken(): string | null;
  getRefreshToken(): string | null;
  clearTokens(): void;
  refreshAccessToken(): Promise<string>;
  isTokenExpired(token: string): boolean;
  getTokenExpirationTime(token: string): number;
  scheduleTokenRefresh(): void;
}

export interface AuthContextType {
  userAuth: UserAuthResponse | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}