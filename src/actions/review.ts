import type { QueryFunction } from "react-query";
import { authRequest } from "../utils/request";
import urls from "../utils/urls";
import type { ReviewSummaryType, ReviewType } from "../types/Review";
import type { RestaurantType } from "../types/Restaurant";
import { uploadImage } from "../utils/image";

export const fetchReviews: QueryFunction<
  ReviewType[],
  [
    string,
    {
      user?: string;
      restaurant?: string;
      tags?: string[];
      page?: number;
      perPage?: number;
    }
  ]
> = async ({ queryKey }): Promise<ReviewType[]> => {
  const [_key, params = {}] = queryKey;
  const { data: json } = await authRequest.get(`${urls.api}/review`, {
    params,
  });

  return json.reviews;
};

export const fetchReviewSummary: QueryFunction<
  ReviewSummaryType,
  [string, string]
> = async ({ queryKey }): Promise<ReviewSummaryType> => {
  const [_key, restaurant] = queryKey;
  const { data: json } = await authRequest.get(`${urls.api}/review`, {
    params: {
      restaurant,
    },
  });

  return json;
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
  const photoUrls = review.photoUrls.filter((i) => i != null);

  const { data: json } = await authRequest.post(
    `${urls.api}/review`,
    JSON.stringify({
      ...review,
      photoUrls: [...new Array(photoUrls.length).fill(null)],
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  await Promise.all(
    json.uploadUrls.map((uploadUrl, index) =>
      uploadImage(photoUrls[index], uploadUrl)
    )
  );

  return json.review;
};
