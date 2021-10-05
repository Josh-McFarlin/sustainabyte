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

  if (user == null) {
    return null;
  }

  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="RestaurantMap" component={RestaurantMapScreen} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default AuthedNavigator;
