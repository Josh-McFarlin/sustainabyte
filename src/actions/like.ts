import type { QueryFunction } from "react-query";
import { authRequest } from "../utils/request";
import urls from "../utils/urls";
import usersStore from "../utils/userData";
import { CheckInType } from "../types/CheckIn";
import { PostType } from "../types/Post";
import { ReviewType } from "../types/Review";

export const toggleLike = async (
  contentType: "CheckIn" | "Post" | "Review",
  contentId: CheckInType["_id"] | PostType["_id"] | ReviewType["_id"]
): Promise<CheckInType | PostType | ReviewType> => {
  const { data: json } = await authRequest.post(
    `${urls.api}/like`,
    JSON.stringify({
      contentType,
      contentId,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return json.content;
};
