import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import HomeScreen from "./screens/Home";
import RestaurantMapScreen from "./screens/RestaurantMap";
import DiscoverScreen from "./screens/Discover";
import LeaderboardScreen from "./screens/Leaderboard";
import ProfileScreen from "./screens/Profile";
import type { TabNavParamList, StackNavParamList } from "./types";
import { useAuth } from "../../utils/auth";
import PreferencesScreen from "./screens/Preferences";
import AccountSettingsScreen from "./screens/AccountSettings";

const Stack = createNativeStackNavigator<StackNavParamList>();
const Tab = createBottomTabNavigator<TabNavParamList>();

const TabbedNavigator: React.FC = () => {
  const { user } = useAuth();

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
        initialParams={{
          userId: user.id,
          isOwnProfile: true,
          isFollowing: true,
        }}
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

const AuthedNavigator: React.FC = () => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tabs"
        component={TabbedNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Group
        screenOptions={{
          presentation: "card",
          headerTitleAlign: "center",
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen
          name="UserProfile"
          component={ProfileScreen}
          options={{
            headerTitle: "Profile",
          }}
        />
        <Stack.Screen
          name="Preferences"
          component={PreferencesScreen}
          options={{
            headerTitle: "Preferences",
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="AccountSettings"
          component={AccountSettingsScreen}
          options={{
            headerTitle: "Account Settings",
            gestureEnabled: false,
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default AuthedNavigator;
