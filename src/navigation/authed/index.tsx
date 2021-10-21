import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import HomeScreen from "./screens/Home";
import RestaurantMapScreen from "./screens/RestaurantMap";
import DiscoverScreen from "./screens/Discover";
import LeaderboardScreen from "./screens/Leaderboard";
import ProfileScreen from "./screens/Profile";
import type { AuthedNavParamList } from "./types";
import { useAuth } from "../../utils/auth";

const Tab = createBottomTabNavigator<AuthedNavParamList>();

const AuthedNavigator: React.FC = () => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return null;
  }

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
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          title: "Discover",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="search" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="RestaurantMap"
        component={RestaurantMapScreen}
        options={{
          title: "Map",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="map-marked-alt" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{
          title: "Leaderboard",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="crown" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user-circle" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AuthedNavigator;
