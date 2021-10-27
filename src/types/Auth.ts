import type { User } from "./User";

export interface Auth0User {
  aud: string;
  exp: number;
  iat: number;
  iss: string;
  email: string;
  name: string;
  username?: string;
  nickname: string;
  nonce: string;
  picture: string;
  sub: string;
  // eslint-disable-next-line camelcase
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  isInitializing: boolean;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}
