import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import firebase from "firebase";
import { QueryClient, QueryClientProvider } from "react-query";
import AuthedNavigator from "./src/navigation/authed";
import UnauthedNavigator from "./src/navigation/unauthed";
import { AuthContext } from "./src/utils/auth";
import { observeAuthState } from "./src/utils/firebase/actions/auth";
import SplashScreen from "./src/components/SplashScreen";
import { makeServer } from "./src/actions/mockServer";

type User = firebase.User;

if (process.env.NODE_ENV === "development") {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (window.server) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    server.shutdown();
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.server = makeServer({ environment: "development" });
}

const queryClient = new QueryClient();

const App: React.FC = () => {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    setLoading(false);

    observeAuthState((u) => {
      setUser(u);
    });
  }, []);

  // const isLoggedIn = user != null;
  const isLoggedIn = true;

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider
        value={{
          loading,
          user,
          isLoggedIn,
        }}
      >
        {loading ? (
          <SplashScreen />
        ) : (
          <NavigationContainer>
            {isLoggedIn ? <AuthedNavigator /> : <UnauthedNavigator />}
          </NavigationContainer>
        )}
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
