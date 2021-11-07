import type { QueryFunction } from "react-query";
import { authRequest } from "../utils/request";
import urls from "../utils/urls";
import type { ReviewType } from "../types/Review";

export const fetchReviews: QueryFunction<ReviewType[], [string]> =
  async (): Promise<ReviewType[]> => {
    const { data: json } = await authRequest.get(`${urls.api}/review`);

    return json.reviews;
  };

export const fetchReview: QueryFunction<ReviewType, [string, string]> = async ({
  queryKey,
}): Promise<ReviewType> => {
  const [_key, reviewId] = queryKey;

  const { data: json } = await authRequest.get(
    `${urls.api}/review/${encodeURIComponent(reviewId)}`
  );

  return json.review;
};

export const createReview = async (
  review: Pick<
    ReviewType,
    "restaurant" | "stars" | "body" | "tags" | "photoUrls"
  >
): Promise<ReviewType> => {
  const { data: json } = await authRequest.post(
    `${urls.api}/review`,
    JSON.stringify(review),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return json.review;
};
