import type { UserType } from "./User";
import type { RestaurantType } from "./Restaurant";

export interface PostType {
  id: string;
  user?: UserType["id"];
  restaurant?: RestaurantType["id"];
  ownerType: "User" | "Restaurant";
  body: string;
  photoUrls: string[];
  tags: string[];
  createdAt: Date;
}
