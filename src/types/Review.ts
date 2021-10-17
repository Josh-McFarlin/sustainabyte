import type { Restaurant } from "./Restaurant";
import type { User } from "./User";

export interface Review {
  id: string;
  user: User["id"];
  restaurant: Restaurant["id"];
  createdAt: number;
  stars: number;
  body: string;
  tags: string[];
  photos: string[];
  score: number;
}
