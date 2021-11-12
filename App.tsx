import * as React from "react";
import "react-native-reanimated";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "react-query";
import { SingletonHooksContainer } from "react-singleton-hook";
import { StatusBar } from "expo-status-bar";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import {
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import AuthedNavigator from "./src/navigation/authed";
import UnauthedNavigator from "./src/navigation/unauthed";
import { useAuth } from "./src/utils/auth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    },
  },
});

const cacheImages = (images) =>
  images.map((image) => Asset.fromModule(image).downloadAsync());

const cacheFonts = (fonts) => fonts.map((font) => Font.loadAsync(font));

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
    require("./assets/icons/camera-white.png"),
    require("./assets/icons/camera-white-no-bg.png"),
    require("./assets/icons/sombrero.png"),
    require("./assets/icons/pin.png"),
    require("./assets/icons/vigilante.png"),
    require("./assets/icons/hexagon.png"),
    require("./assets/icons/leafs.png"),
    require("./assets/icons/mountain.png"),
  ]);

  const fontAssets = cacheFonts([
    FontAwesome.font,
    FontAwesome5.font,
    Ionicons.font,
    MaterialIcons.font,
    MaterialCommunityIcons.font,
  ]);

  await Promise.all([...imageAssets, ...fontAssets]);
};

const Navigation: React.FC = () => {
  const { isInitializing, isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

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
