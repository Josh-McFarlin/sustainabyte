import type { UserType } from "./User";
import type { ReviewType } from "./Review";

export interface SocialGroupType {
  _id: string;
  name: string;
  description: string;
  tags: string[];
  iconUrl: string;
  owner: UserType["_id"];
  members: UserType["_id"][];
  reviews: ReviewType["_id"][];
  createdAt: Date;
}
