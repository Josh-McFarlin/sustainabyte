import * as React from "react";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import jwtDecode from "jwt-decode";
import { Alert, Platform } from "react-native";
import { singletonHook } from "react-singleton-hook";
import { useQuery } from "react-query";
import * as SecureStore from "./SecureStore";
import { v4 as uuid } from "./uuid";
import type { AuthContextType, Auth0User } from "../types/Auth";
import { fetchAuth } from "../actions/auth";
import { UserType } from "../types/User";
import { authRequest } from "./request";

const authStorageKey = "AuthObject";
const auth0ClientId = "g5aCxDpiXTWG4pqNSNPYyN06KBgw610q";
const authorizationEndpoint = "https://dev-k6-rerdh.us.auth0.com/authorize";

const useProxy = Platform.select({ web: false, default: true });
const redirectUri = AuthSession.makeRedirectUri({ useProxy });
WebBrowser.maybeCompleteAuthSession({
  skipRedirectCheck: true,
});

const saveAuthToken = async (authToken: string) => {
  await SecureStore.setItemAsync(authStorageKey, authToken);
};

const getAuthObject = async (): Promise<{
  token: string;
  object: Auth0User;
} | null> => {
  const res = await SecureStore.getItemAsync(authStorageKey);

  if (res == null) {
    return null;
  }

  try {
    const decodedObj: Auth0User = jwtDecode(res);

    if (decodedObj.exp == null || decodedObj.exp * 1000 < Date.now()) {
      throw new Error("Auth Object has expired!");
    }

    return {
      token: res,
      object: decodedObj,
    };
  } catch (error) {
    console.error("Auth Error:", error?.message || error);
    return null;
  }
};

const clearAuthObject = (): Promise<void> =>
  SecureStore.deleteItemAsync(authStorageKey);

export const useAuthBase = (): AuthContextType => {
  const nonce = React.useRef<string>(uuid().replace(/-/g, ""));
  const [auth0Token, setAuth0Token] = React.useState<string | null>(null);
  const [auth0User, setAuth0User] = React.useState<Auth0User | null>(null);
  const [isInitializing, setIsInitializing] = React.useState<boolean>(true);
  const { data: user, remove } = useQuery<UserType, Error>(
    ["user", auth0User?.sub],
    fetchAuth,
    {
      enabled: auth0User?.sub != null,
      initialData: null,
      onSuccess: () => {
        setIsInitializing(false);
      },
    }
  );

  const [request, result, promptAsync] = AuthSession.useAuthRequest(
    {
      redirectUri,
      clientId: auth0ClientId,
      responseType: "id_token",
      scopes: ["openid", "profile", "name", "email"],
      extraParams: {
        nonce: nonce.current,
      },
    },
    { authorizationEndpoint }
  );

  React.useEffect(() => {
    getAuthObject().then((storedAuth) => {
      if (storedAuth != null) {
        setAuth0Token(storedAuth.token);
        setAuth0User(storedAuth.object);
      } else {
        setIsInitializing(false);
      }
    });
  }, []);

  React.useEffect(() => {
    if (result != null) {
      switch (result?.type) {
        case "success": {
          const jwtToken = result.params.id_token;
          const decoded = jwtDecode<Auth0User>(jwtToken);

          setAuth0Token(jwtToken);
          setAuth0User(decoded);
          saveAuthToken(jwtToken);

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
    }
  }, [result]);

  const login = React.useCallback(
    async (): Promise<AuthSession.AuthSessionResult> =>
      promptAsync({ useProxy }),
    [promptAsync]
  );

  const logout = React.useCallback(async () => {
    setAuth0User(null);
    setAuth0Token(null);
    await clearAuthObject();
    remove();
  }, [remove]);

  React.useEffect(() => {
    console.log("create interceptor:", auth0Token != null);
    const interceptor = authRequest.interceptors.request.use(
      async (config) => {
        // eslint-disable-next-line no-param-reassign
        config.headers = {
          Authorization: `Bearer ${auth0Token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        };

        return config;
      },
      async (error) => {
        console.log("caught error");
        console.log(1, error?.response);
        console.log(2, error?.response?.status);
        console.log(3, error);
        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403
        ) {
          try {
            await logout();
          } catch (_) {
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      authRequest.interceptors.request.eject(interceptor);
    };
  }, [auth0Token, logout]);

  return {
    user,
    saved: new Set<string>(),
    isInitializing: !request || isInitializing,
    isLoggedIn: auth0User != null && user != null,
    login,
    logout,
  };
};

const initAuth: AuthContextType = {
  user: null,
  saved: new Set<string>(),
  isInitializing: true,
  isLoggedIn: false,
  login: null,
  logout: null,
};

export const useAuth = singletonHook(initAuth, useAuthBase);
