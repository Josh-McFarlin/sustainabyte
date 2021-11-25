import type { QueryFunction } from "react-query";
import { authRequest } from "../utils/request";
import urls from "../utils/urls";
import { requestUpload, getContentType, uploadImage } from "../utils/image";
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
  post: Pick<
    PostType,
    "ownerType" | "restaurant" | "body" | "photoUrls" | "tags"
  >
): Promise<PostType> => {
  const uploads = await requestUpload(post.photoUrls.map(getContentType));

  const photoUrls = await Promise.all(
    uploads.map(async (upload, index) => {
      await uploadImage(post.photoUrls[index], upload.uploadUrl);

      return upload.fileUrl;
    })
  );

  const { data: json } = await authRequest.post(
    `${urls.api}/post`,
    JSON.stringify({
      ...post,
      photoUrls,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return json.post;
};

export const deletePost = async (postId: PostType["_id"]): Promise<boolean> => {
  const { status } = await authRequest.delete(
    `${urls.api}/post/${encodeURIComponent(postId)}`
  );

  return status === 200;
};
