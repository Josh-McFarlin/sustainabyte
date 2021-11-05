import type { QueryFunction } from "react-query";
import urls from "../utils/urls";
import type { ReviewType } from "../types/Review";

export const fetchReviews: QueryFunction<ReviewType[], [string]> =
  async (): Promise<ReviewType[]> => {
    const response = await fetch(`${urls.api}/review`);

    if (!response.ok) {
      throw new Error("Network response was not ok!");
    }

    const json = await response.json();

    return json.reviews;
  };

export const fetchReview: QueryFunction<ReviewType, [string, string]> = async ({
  queryKey,
}): Promise<ReviewType> => {
  const [_key, reviewId] = queryKey;

  const response = await fetch(`${urls.api}/review/${reviewId}`);

  if (!response.ok) {
    throw new Error("Network response was not ok!");
  }

  const json = await response.json();

  return json.review;
};

export const createReview = async (review: ReviewType): Promise<ReviewType> => {
  const response = await fetch(`${urls.api}/review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(review),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok!");
  }

  const json = await response.json();

  return json.review;
};
