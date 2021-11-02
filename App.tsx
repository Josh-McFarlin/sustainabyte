import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "react-query";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { persistQueryClient } from "react-query/persistQueryClient-experimental";
// import { createAsyncStoragePersistor } from "react-query/createAsyncStoragePersistor-experimental";
import { SingletonHooksContainer } from "react-singleton-hook";
import { StatusBar } from "expo-status-bar";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
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
      // staleTime: 300000, // 5 minutes
      // staleTime: 10000, // 10 seconds
      // cacheTime: 1000 * 60 * 60 * 24, // 24 hours,
      refetchOnWindowFocus: false,
    },
  },
});

const cacheImages = (images) =>
  images.map((image) => Asset.fromModule(image).downloadAsync());

const cacheFonts = (fonts) => fonts.map((font) => Font.loadAsync(font));

const Navigation: React.FC = () => {
  const { isInitializing, isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const loadAssetsAsync = async () => {
    const imageAssets = cacheImages([
      require("./assets/icons/american.png"),
      require("./assets/icons/asian.png"),
      require("./assets/icons/healthy.png"),
      require("./assets/icons/indian.png"),
      require("./assets/icons/italian.png"),
      require("./assets/icons/lebanese.png"),
      require("./assets/icons/mexican.png"),
      require("./assets/icons/sandwiches.png"),
      require("./assets/icons/vegan.png"),
    ]);

    const fontAssets = cacheFonts([
      FontAwesome.font,
      FontAwesome5.font,
      Ionicons.font,
    ]);

    await Promise.all([...imageAssets, ...fontAssets]);
  };

  if (isInitializing || isLoading) {
    return (
      <AppLoading
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
