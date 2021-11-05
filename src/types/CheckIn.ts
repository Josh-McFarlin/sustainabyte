import type { RestaurantType } from "./Restaurant";
import type { UserType } from "./User";

export interface CheckInType {
  id: string;
  user: UserType["id"];
  restaurant: RestaurantType["id"];
  withUsers: UserType["id"][];
  createdAt: number;
}
