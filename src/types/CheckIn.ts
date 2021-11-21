import type { RestaurantType } from "./Restaurant";
import type { UserType } from "./User";

export interface CheckInType {
  _id: string;
  user: UserType["_id"];
  restaurant: RestaurantType["_id"];
  withUsers: UserType["_id"][];
  likedBy: UserType["_id"][];
  createdAt: number;
}
