import { UserType } from "./User";
import { RestaurantType } from "./Restaurant";

export interface FollowType {
  _id: string;
  fromType: "User" | "Restaurant";
  from: UserType["_id"] | RestaurantType["_id"];
  toType: "User" | "Restaurant";
  to: UserType["_id"] | RestaurantType["_id"];
}
