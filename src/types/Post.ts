import type { UserType } from "./User";
import type { RestaurantType } from "./Restaurant";

export interface PostType {
  _id: string;
  user?: UserType["_id"];
  restaurant?: RestaurantType["_id"];
  ownerType: "User" | "Restaurant";
  body: string;
  photoUrls: string[];
  tags: string[];
  createdAt: Date;
}
