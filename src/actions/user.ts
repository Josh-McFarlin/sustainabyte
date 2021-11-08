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

  return json.user;
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
