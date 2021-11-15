import type { AuthSessionResult } from "expo-auth-session";
import type { UserType } from "./User";

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
  user: UserType | null;
  saved: Set<string>;
  isInitializing: boolean;
  isLoggedIn: boolean;
  login: () => Promise<AuthSessionResult>;
  logout: () => Promise<void>;
}
