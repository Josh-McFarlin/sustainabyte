import type { UserType } from "./User";
import type { RestaurantType } from "./Restaurant";

export interface ReviewType {
  id: string;
  user: UserType["id"];
  restaurant: RestaurantType["id"];
  stars: number;
  body: string;
  tags: string[];
  photoUrls: string[];
  createdAt: Date;
}
