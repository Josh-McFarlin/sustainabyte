import type { User } from "./User";
import type { Review } from "./Review";

export interface SocialGroup {
  id: string;
  createdAt: number;
  name: string;
  description: string;
  icon: string;
  members: User["id"][];
  reviews: Review[];
}
