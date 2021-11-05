import type { RestaurantType } from "./Restaurant";

export interface OfferType {
  id: string;
  restaurant: RestaurantType["id"];
  photoUrl: string;
  title: string;
  body: string;
  prompt?: string;
  createdAt: Date;
  expiresAt: Date;
}
