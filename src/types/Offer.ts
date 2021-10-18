import type { Restaurant } from "./Restaurant";

export interface Offer {
  id: string;
  restaurant: Restaurant["id"];
  createdAt: number;
  expiresAt: number;
  photo: string;
  title: string;
  body: string;
  prompt?: string;
}
