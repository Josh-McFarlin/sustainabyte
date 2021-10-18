import * as React from "react";
import type { User } from "../types/User";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
}

const initAuth: AuthContextType = {
  user: null,
  loading: true,
  isLoggedIn: false,
};

export const AuthContext = React.createContext(initAuth);

export const useAuth = (): AuthContextType => React.useContext(AuthContext);
