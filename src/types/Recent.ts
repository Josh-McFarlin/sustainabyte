import { PostType } from "./Post";
import { ReviewType } from "./Review";
import { CheckInType } from "./CheckIn";

export interface RecentType {
  type: "POST" | "REVIEW" | "CHECKIN";
  data: PostType | ReviewType | CheckInType;
}
