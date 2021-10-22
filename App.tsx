import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "react-query";
import { SingletonHooksContainer } from "react-singleton-hook";
import { StatusBar } from "expo-status-bar";
import { Asset } from "expo-asset";
import AppLoading from "expo-app-loading";
import AuthedNavigator from "./src/navigation/authed";
import UnauthedNavigator from "./src/navigation/unauthed";
import { useAuth } from "./src/utils/auth";
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

const cacheImages = (images) =>
  images.map((image) => Asset.fromModule(image).downloadAsync());

const Navigation: React.FC = () => {
  const { isInitializing, isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const loadAssetsAsync = async () => {
    const imageAssets = cacheImages([
      require("./assets/icons/asian.png"),
      require("./assets/icons/healthy.png"),
      require("./assets/icons/indian.png"),
      require("./assets/icons/mexican.png"),
      require("./assets/icons/sandwiches.png"),
      require("./assets/icons/vegan.png"),
    ]);

    await Promise.all(imageAssets);
  };

  if (isInitializing || isLoading) {
    return (
      <AppLoading
        autoHideSplash
        startAsync={loadAssetsAsync}
        onFinish={() => setIsLoading(false)}
        onError={console.warn}
      />
    );
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
    <StatusBar style="dark" />
    <Navigation />
  </QueryClientProvider>
);

export default App;
