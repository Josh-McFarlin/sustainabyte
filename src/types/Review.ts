import type { UserType } from "./User";
import type { RestaurantType } from "./Restaurant";

export interface ReviewType {
  _id: string;
  user: UserType["_id"];
  restaurant: RestaurantType["_id"];
  stars: number;
  body: string;
  tags: string[];
  photoUrls: string[];
  createdAt: Date;
}

export interface ReviewSummaryType {
  _id: RestaurantType["_id"];
  avgRating: number;
  totalReviews: number;
  stars: [number, number, number, number, number];
  reviews: ReviewType[];
  tags: string[];
}
