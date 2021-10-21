import { User } from "./User";

export interface AuthContextType {
  user: User | null;
  isInitializing: boolean;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

export interface Auth0User {
  aud: string;
  exp: number;
  iat: number;
  iss: string;
  name: string;
  nickname: string;
  nonce: string;
  picture: string;
  sub: string;
  // eslint-disable-next-line camelcase
  updated_at: string;
}
