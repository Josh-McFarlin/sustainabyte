import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/Home";
import RestaurantMapScreen from "./screens/RestaurantMap";
import DiscoverScreen from "./screens/Discover";
import LeaderboardScreen from "./screens/Leaderboard";
import ProfileScreen from "./screens/Profile";
import type { AuthedNavParamList } from "./types";
import { useAuth } from "../../utils/auth";

const Tab = createBottomTabNavigator<AuthedNavParamList>();

const AuthedNavigator: React.FC = () => {
  const { user } = useAuth();

  // if (user == null) {
  //   return null;
  // }

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Home",
        }}
      />
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          title: "Discover",
        }}
      />
      <Tab.Screen
        name="RestaurantMap"
        component={RestaurantMapScreen}
        options={{
          title: "Map",
        }}
      />
      <Tab.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{
          title: "Leaderboard",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
        }}
      />
    </Tab.Navigator>
  );
};

export default AuthedNavigator;
