import { CompositeNavigationProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { UserType } from "../../types/User";
import type {
  BasicRestaurantType,
  RestaurantType,
} from "../../types/Restaurant";
import { PostType } from "../../types/Post";
import { ReviewType } from "../../types/Review";

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
  UploadPost: {
    restaurant?: RestaurantType | BasicRestaurantType;
  };
  UploadReview: {
    restaurant?: RestaurantType | BasicRestaurantType;
  };
  Post: {
    id: PostType["_id"];
    post?: PostType;
  };
  Review: {
    id: ReviewType["_id"];
    review?: ReviewType;
  };
};

export type AuthNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<StackNavParamList>,
  BottomTabNavigationProp<TabNavParamList>
>;
