import type { QueryFunction } from "react-query";
import axios from "axios";
import urls from "../utils/urls";
import { uploadImage } from "../utils/image";
import type { PostType } from "../types/Post";

export const fetchPosts: QueryFunction<PostType[], [string]> = async ({
  queryKey,
}): Promise<PostType[]> => {
  const [_key] = queryKey;

  const { data: json } = await axios.get(`${urls.api}/post`);

  return json.posts;
};

export const fetchPost: QueryFunction<PostType, [string, string]> = async ({
  queryKey,
}): Promise<PostType> => {
  const [_key, postId] = queryKey;

  const { data: json } = await axios.get(`${urls.api}/post/${postId}`);

  return json.post;
};

export const createPost = async (
  post: Pick<PostType, "ownerType" | "body" | "photoUrls" | "tags">
): Promise<PostType> => {
  const { data: json } = await axios.post(
    `${urls.api}/post`,
    JSON.stringify({
      ...post,
      photoUrls: new Array(Array(post.photoUrls.length)),
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  await Promise.all(
    (json.post.photoUrls as string[]).map((uploadUrl, index) =>
      uploadImage(post.photoUrls[index], uploadUrl)
    )
  );

  return json.post;
};
