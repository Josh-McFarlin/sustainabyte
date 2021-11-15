import type { QueryFunction } from "react-query";
import { authRequest } from "../utils/request";
import urls from "../utils/urls";
import type { UserType } from "../types/User";

export const fetchAuth: QueryFunction<UserType, [string, string]> = async ({
  queryKey,
}): Promise<UserType> => {
  const [_key, id] = queryKey;

  const { data: json } = await authRequest.get(
    `${urls.api}/auth/${encodeURIComponent(id)}`,
    {
      params: {
        type: "USER",
      },
    }
  );

  if (!json.auth) {
    throw new Error("Invalid user!");
  }

  const { data: followersJson } = await authRequest.get(`${urls.api}/follow`, {
    params: {
      toType: "User",
      to: json.auth._id,
      simpleType: "from",
    },
  });

  const { data: followingJson } = await authRequest.get(`${urls.api}/follow`, {
    params: {
      fromType: "User",
      from: json.auth._id,
      simpleType: "to",
    },
  });

  return {
    ...json.auth,
    followers: new Set<UserType["_id"]>(followersJson.follows),
    following: new Set<UserType["_id"]>(followingJson.follows),
  };
};
