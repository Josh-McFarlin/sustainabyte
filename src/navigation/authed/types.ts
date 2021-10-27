import { CompositeNavigationProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { User } from "../../types/User";
import type { Restaurant } from "../../types/Restaurant";

export type TabNavParamList = {
  Home: Record<string, never>;
  RestaurantMap: Record<string, never>;
  Discover: Record<string, never>;
  Leaderboard: Record<string, never>;
  UserProfile: {
    userId: User["id"];
    isOwnProfile: boolean;
    isFollowing: boolean;
  };
  RestaurantProfile: {
    restaurantId: Restaurant["id"];
    isOwnProfile: boolean;
    isFollowing: boolean;
  };
};

export type StackNavParamList = {
  Tabs: TabNavParamList;
  UserProfile: TabNavParamList["UserProfile"];
  RestaurantProfile: TabNavParamList["RestaurantProfile"];
  Preferences: Record<string, never>;
  AccountSettings: Record<string, never>;
};

export type AuthNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabNavParamList>,
  NativeStackNavigationProp<StackNavParamList>
>;
