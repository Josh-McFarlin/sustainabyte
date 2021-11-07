import type { RestaurantType } from "./Restaurant";

export interface OfferType {
  _id: string;
  restaurant: RestaurantType["_id"];
  photoUrl: string;
  title: string;
  body: string;
  prompt?: string;
  createdAt: Date;
  expiresAt: Date;
}
