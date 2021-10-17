import type { User } from "./User";
import type { Restaurant } from "./Restaurant";

export interface Post {
  id: string;
  user: User["id"];
  restaurant: Restaurant["id"];
  createdAt: number;
  body: string;
  pictures: string[];
}
