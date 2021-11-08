import type { QueryFunction } from "react-query";
import { authRequest } from "../utils/request";
import urls from "../utils/urls";
import { uploadImage } from "../utils/image";
import type { PostType } from "../types/Post";

export const fetchPosts: QueryFunction<
  PostType[],
  [
    string,
    {
      user?: string;
      restaurant?: string;
      ownerType?: "User" | "Restaurant";
      tags?: string[];
      page?: number;
      perPage?: number;
    }
  ]
> = async ({ queryKey }): Promise<PostType[]> => {
  const [_key, params = {}] = queryKey;

  const { data: json } = await authRequest.get(`${urls.api}/post`, {
    params,
  });

  return json.posts;
};

export const fetchPost: QueryFunction<PostType, [string, string]> = async ({
  queryKey,
}): Promise<PostType> => {
  const [_key, postId] = queryKey;

  const { data: json } = await authRequest.get(
    `${urls.api}/post/${encodeURIComponent(postId)}`
  );

  return json.post;
};

export const createPost = async (
  post: Pick<PostType, "ownerType" | "body" | "photoUrls" | "tags">
): Promise<PostType> => {
  const photoUrls = post.photoUrls.filter((i) => i != null);

  const { data: json } = await authRequest.post(
    `${urls.api}/post`,
    JSON.stringify({
      ...post,
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

  return json.post;
};
