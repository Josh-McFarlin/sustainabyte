import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "react-query";
import { SingletonHooksContainer } from "react-singleton-hook";
import { StatusBar } from "expo-status-bar";
import AppLoading from "expo-app-loading";
import AuthedNavigator from "./src/navigation/authed";
import UnauthedNavigator from "./src/navigation/unauthed";
import { useAuth } from "./src/utils/auth";
import SplashScreen from "./src/components/SplashScreen";
import runServer from "./src/utils/mockServer";

// if (process.env.NODE_ENV === "development") {
runServer();
// }

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      keepPreviousData: true,
    },
  },
});

const Navigation: React.FC = () => {
  const { isInitializing, isLoggedIn } = useAuth();

  if (isInitializing) {
    return <AppLoading autoHideSplash />;
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? <AuthedNavigator /> : <UnauthedNavigator />}
    </NavigationContainer>
  );
};

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <SingletonHooksContainer />
    {/* eslint-disable-next-line react/style-prop-object */}
    <StatusBar style="dark" />
    <Navigation />
  </QueryClientProvider>
);

export default App;
