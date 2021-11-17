import { CompositeNavigationProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { UserType } from "../../types/User";
import type {
  BasicRestaurantType,
  RestaurantType,
} from "../../types/Restaurant";
import { CategoryPostsType, PostType } from "../../types/Post";
import { ReviewType } from "../../types/Review";

export type TabNavParamList = {
  Home: Record<string, never>;
  Discover: Record<string, never>;
  Leaderboard: Record<string, never>;
  Profile: {
    id: UserType["_id"] | RestaurantType["_id"];
  };
};

export type StackNavParamList = {
  Tabs: TabNavParamList;
  UserProfile: {
    id: UserType["_id"];
  };
  RestaurantProfile: {
    id: RestaurantType["_id"];
  };
  Preferences: Record<string, never>;
  AccountSettings: Record<string, never>;
  UploadPost: {
    restaurant?: RestaurantType | BasicRestaurantType;
  };
  UploadReview: {
    restaurant?: RestaurantType | BasicRestaurantType;
  };
  CreateChallenge: Record<string, never>;
  Post: {
    id: PostType["_id"];
    post?: PostType;
  };
  PostCategory: CategoryPostsType;
  Review: {
    id: ReviewType["_id"];
    review?: ReviewType;
  };
};

export type AuthNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<StackNavParamList>,
  BottomTabNavigationProp<TabNavParamList>
>;
