import { PostType } from "./Post";
import { ReviewType } from "./Review";
import { CheckInType } from "./CheckIn";

export interface RecentType {
  _id: string;
  type: "Post" | "Review" | "CheckIn";
  data: PostType | ReviewType | CheckInType;
}
