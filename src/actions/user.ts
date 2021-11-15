import type { QueryFunction } from "react-query";
import { authRequest } from "../utils/request";
import urls from "../utils/urls";
import type { UserType } from "../types/User";

export const fetchUsers: QueryFunction<
  UserType[],
  [
    string,
    {
      email?: string;
      username?: string;
    }
  ]
> = async ({ queryKey }): Promise<UserType[]> => {
  const [_key, params = {}] = queryKey;
  const { data: json } = await authRequest.get(`${urls.api}/user`, {
    params,
  });

  return json.users;
};

export const fetchUser: QueryFunction<UserType, [string, string]> = async ({
  queryKey,
}): Promise<UserType> => {
  const [_key, userId] = queryKey;

  const { data: json } = await authRequest.get(
    `${urls.api}/user/${encodeURIComponent(userId)}`
  );

  const { data: followersJson } = await authRequest.get(`${urls.api}/follow`, {
    params: {
      toType: "User",
      to: json.user._id,
      simpleType: "from",
    },
  });

  const { data: followingJson } = await authRequest.get(`${urls.api}/follow`, {
    params: {
      fromType: "User",
      from: json.user._id,
      simpleType: "to",
    },
  });

  return {
    ...json.user,
    followers: new Set<UserType["_id"]>(followersJson.follows),
    following: new Set<UserType["_id"]>(followingJson.follows),
  };
};

export const updateUser = async (
  user: Pick<
    UserType,
    "name" | "avatarUrl" | "locations" | "groups" | "followers" | "following"
  >
): Promise<UserType> => {
  const { data: json } = await authRequest.put(
    `${urls.api}/user`,
    JSON.stringify(user),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return json.user;
};
