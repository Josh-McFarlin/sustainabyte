import type { QueryFunction } from "react-query";
import urls from "../utils/urls";
import type { PostType } from "../types/Post";

export const fetchPosts: QueryFunction<PostType[], [string]> = async ({
  queryKey,
}): Promise<PostType[]> => {
  const [_key] = queryKey;

  const response = await fetch(`${urls.api}/post`);

  if (!response.ok) {
    throw new Error("Network response was not ok!");
  }

  const json = await response.json();

  return json.posts;
};

export const fetchPost: QueryFunction<PostType, [string, string]> = async ({
  queryKey,
}): Promise<PostType> => {
  const [_key, postId] = queryKey;

  const response = await fetch(`${urls.api}/post/${postId}`);

  if (!response.ok) {
    throw new Error("Network response was not ok!");
  }

  const json = await response.json();

  return json.post;
};

export const createPost = async (post: PostType): Promise<PostType> => {
  const response = await fetch(`${urls.api}/post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok!");
  }

  const json = await response.json();

  return json.post;
};
