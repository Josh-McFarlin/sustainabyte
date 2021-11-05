import type { UserType } from "./User";
import type { ReviewType } from "./Review";

export interface SocialGroupType {
  id: string;
  name: string;
  description: string;
  tags: string[];
  iconUrl: string;
  owner: UserType["id"];
  members: UserType["id"][];
  reviews: ReviewType["id"][];
  createdAt: Date;
}
