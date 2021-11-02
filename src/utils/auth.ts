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
import { fetchUser } from "../actions/user";
import { User } from "../types/User";

const authStorageKey = "AuthObject";
const auth0ClientId = "g5aCxDpiXTWG4pqNSNPYyN06KBgw610q";
const authorizationEndpoint = "https://dev-k6-rerdh.us.auth0.com/authorize";

const useProxy = Platform.select({ web: false, default: true });
const redirectUri = AuthSession.makeRedirectUri({ useProxy });
WebBrowser.maybeCompleteAuthSession({
  skipRedirectCheck: true,
});

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
  const [addedDB, setAddedDB] = React.useState<boolean>(false);
  const {
    data: user,
    remove,
    refetch,
  } = useQuery<User, Error>(["user", auth0User?.sub], fetchUser, {
    enabled: auth0User?.sub != null && addedDB,
    initialData: null,
  });
  const [isInitializing, setIsInitializing] = React.useState<boolean>(true);
  const nonce = React.useRef<string>(uuid().replace(/-/g, ""));

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
    getAuthObject().then((storedAuth: Auth0User | null) => {
      if (storedAuth) {
        setAuth0User(storedAuth);
      }
    });
  }, []);

  React.useEffect(() => {
    if (result != null) {
      switch (result?.type) {
        case "success": {
          const jwtToken = result.params.id_token;
          const decoded = jwtDecode(jwtToken);

          setAuth0User(decoded as any);
          saveAuthObject(decoded as any);

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

  React.useEffect(() => {
    if ((window as any).server && auth0User != null) {
      (window as any).server.create("user", {
        id: auth0User.sub,
        name: auth0User.username || auth0User.nickname,
        email: auth0User.email,
        username: auth0User.username || auth0User.nickname,
        avatarUrl: auth0User.picture,
        score: 0,
        locations: [],
        groups: [],
      });

      setAddedDB(true);
      refetch().then(() => {
        setIsInitializing(false);
      });
    }
  }, [refetch, auth0User]);

  const login = React.useCallback(
    async (): Promise<AuthSession.AuthSessionResult> =>
      promptAsync({ useProxy }),
    [promptAsync]
  );

  const logout = React.useCallback(() => {
    setAuth0User(null);
    clearAuthObject();
    remove();
  }, [remove]);

  // console.log({
  //   addedDB,
  //   auth0User,
  //   user,
  //   isInitializing,
  //   isLoggedIn: user != null,
  // });

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
