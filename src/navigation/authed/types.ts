import { CompositeNavigationProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { UserType } from "../../types/User";
import type { RestaurantType } from "../../types/Restaurant";

export type TabNavParamList = {
  Home: Record<string, never>;
  Discover: Record<string, never>;
  Leaderboard: Record<string, never>;
  Profile: {
    id: UserType["_id"] | RestaurantType["_id"];
    isOwnProfile: boolean;
    isFollowing: boolean;
  };
};

export type StackNavParamList = {
  Tabs: TabNavParamList;
  UserProfile: {
    id: UserType["_id"];
    isOwnProfile: boolean;
    isFollowing: boolean;
  };
  RestaurantProfile: {
    id: RestaurantType["_id"];
    isOwnProfile: boolean;
    isFollowing: boolean;
  };
  Preferences: Record<string, never>;
  AccountSettings: Record<string, never>;
  UploadPost: Record<string, never>;
};

export type AuthNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabNavParamList>,
  NativeStackNavigationProp<StackNavParamList>
>;
