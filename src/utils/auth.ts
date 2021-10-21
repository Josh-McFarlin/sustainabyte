import * as React from "react";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import jwtDecode from "jwt-decode";
import { Alert, Platform } from "react-native";
import { singletonHook } from "react-singleton-hook";
import * as SecureStore from "./SecureStore";
import { v4 as uuid } from "./uuid";
import type { User } from "../types/User";
import type { AuthContextType, Auth0User } from "../types/Auth";

const authStorageKey = "AuthObject";
const auth0ClientId = "g5aCxDpiXTWG4pqNSNPYyN06KBgw610q";
const authorizationEndpoint = "https://dev-k6-rerdh.us.auth0.com/authorize";

const useProxy = Platform.select({ web: false, default: true });
const redirectUri = AuthSession.makeRedirectUri({ useProxy });
WebBrowser.maybeCompleteAuthSession();

const saveAuthObject = async (authObject: Auth0User) => {
  const authString = JSON.stringify(authObject);

  await SecureStore.setItemAsync(authStorageKey, authString);
};

const getAuthObject = async (): Promise<Auth0User | null> => {
  const res = await SecureStore.getItemAsync(authStorageKey);

  if (res == null) {
    return null;
  }

  try {
    const resObj: Auth0User = JSON.parse(res);

    if (resObj.exp == null || resObj.exp * 1000 < Date.now()) {
      throw new Error("Auth Object has expired!");
    }

    return resObj;
  } catch (error) {
    console.error("Auth Error:", error?.message || error);
    return null;
  }
};

const clearAuthObject = (): Promise<void> =>
  SecureStore.deleteItemAsync(authStorageKey);

export const useAuthBase = (): AuthContextType => {
  const [auth0User, setAuth0User] = React.useState<Auth0User | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const [isInitializing, setIsInitializing] = React.useState<boolean>(true);
  const nonce = React.useRef<string>(uuid().replaceAll("-", ""));

  const [request, result, promptAsync] = AuthSession.useAuthRequest(
    {
      redirectUri,
      clientId: auth0ClientId,
      responseType: "id_token",
      scopes: ["openid", "profile"],
      extraParams: {
        nonce: nonce.current,
      },
    },
    { authorizationEndpoint }
  );

  React.useEffect(() => {
    switch (result?.type) {
      case "success": {
        const jwtToken = result.params.id_token;
        const decoded = jwtDecode(jwtToken);

        console.log("decoded", decoded);
        setAuth0User(decoded as any);
        saveAuthObject(decoded as any);
        setUser(decoded as any);

        break;
      }
      case "error": {
        Alert.alert(
          "Authentication error",
          result.params.error_description || "something went wrong"
        );

        break;
      }
      default: {
        break;
      }
    }
  }, [result]);

  const login = React.useCallback(
    async (): Promise<AuthSession.AuthSessionResult> =>
      promptAsync({ useProxy }),
    [promptAsync]
  );

  const logout = React.useCallback(() => {
    setUser(null);
    setAuth0User(null);
    clearAuthObject();
  }, []);

  console.log({
    user,
    loading: request != null,
    isLoggedIn: user != null,
  });

  React.useEffect(() => {
    getAuthObject()
      .then((storedAuth: Auth0User | null) => {
        if (storedAuth) {
          setAuth0User(storedAuth);
          setUser(storedAuth as any);
        }
      })
      .finally(() => {
        setIsInitializing(false);
      });
  }, []);

  return {
    user,
    isInitializing: !request || isInitializing,
    isLoggedIn: user != null,
    login,
    logout,
  };
};

const initAuth: AuthContextType = {
  user: null,
  isInitializing: true,
  isLoggedIn: false,
  login: null,
  logout: null,
};

export const useAuth = singletonHook(initAuth, useAuthBase);
