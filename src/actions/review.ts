import type { QueryFunction } from "react-query";
import { authRequest } from "../utils/request";
import urls from "../utils/urls";
import type { ReviewSummaryType, ReviewType } from "../types/Review";
import { requestUpload, getContentType, uploadImage } from "../utils/image";

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
  let photoUrls = [];

  if (review.photoUrls.length > 0) {
    const uploads = await requestUpload(review.photoUrls.map(getContentType));

    photoUrls = await Promise.all(
      uploads.map(async (upload, index) => {
        await uploadImage(review.photoUrls[index], upload.uploadUrl);

        return upload.fileUrl;
      })
    );
  }

  const { data: json } = await authRequest.post(
    `${urls.api}/review`,
    JSON.stringify({
      ...review,
      photoUrls,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return json.review;
};
