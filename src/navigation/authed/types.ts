import { CompositeNavigationProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { User } from "../../types/User";

export type TabNavParamList = {
  Home: Record<string, never>;
  RestaurantMap: Record<string, never>;
  Discover: Record<string, never>;
  Leaderboard: Record<string, never>;
  Profile: {
    user: User;
    isOwnProfile: boolean;
    isFollowing: boolean;
  };
};

export type StackNavParamList = {
  Tabs: TabNavParamList;
  UserProfile: TabNavParamList["Profile"];
  Preferences: Record<string, never>;
};

export type AuthNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabNavParamList>,
  NativeStackNavigationProp<StackNavParamList>
>;
