import type { QueryFunction } from "react-query";
import type { Review } from "../types/Review";

export const fetchReviews: QueryFunction<Review[], [string]> =
  async (): Promise<Review[]> => {
    const response = await fetch(`/api/review`);

    if (!response.ok) {
      throw new Error("Network response was not ok!");
    }

    const json = await response.json();

    return json.reviews;
  };

export const fetchReview: QueryFunction<Review, [string, string]> = async ({
  queryKey,
}): Promise<Review> => {
  const [_key, reviewId] = queryKey;

  const response = await fetch(`/api/review/${reviewId}`);

  if (!response.ok) {
    throw new Error("Network response was not ok!");
  }

  const json = await response.json();

  return json.review;
};
