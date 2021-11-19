import type { QueryFunction } from "react-query";
import { authRequest } from "../utils/request";
import urls from "../utils/urls";
import usersStore, { storeUser } from "../utils/userData";
import { UserType } from "../types/User";
import { RestaurantType } from "../types/Restaurant";
import { AccountRefType } from "../types/AccountRef";

export type FollowsResponseType = {
  followers: (UserType | RestaurantType)[] | AccountRefType[] | string[];
  following: (UserType | RestaurantType)[] | AccountRefType[] | string[];
};

export const fetchFollowsById: QueryFunction<
  FollowsResponseType,
  [
    string,
    {
      id: UserType["_id"];
      format?: "simple" | "detailed";
    }
  ]
> = async ({ queryKey }): Promise<FollowsResponseType> => {
  const [_key, params = {}] = queryKey;

  const { data: json } = await authRequest.get(`${urls.api}/follow`, {
    params,
  });

  return json.follows;
};

export const toggleFollow = async (
  followType: "User" | "Restaurant",
  followId: UserType["_id"] | RestaurantType["_id"]
): Promise<UserType> => {
  const { data: json } = await authRequest.post(
    `${urls.api}/follow`,
    JSON.stringify({
      followType,
      followId,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  try {
    const newUser: UserType = <UserType>{
      ...usersStore.users.get(json.user._id),
    };

    if (usersStore.following.has(followId)) {
      usersStore.following.delete(followId);
      newUser.following -= 1;
      (usersStore.users.get(followId) as UserType).followers -= 1;
    } else {
      usersStore.following.add(followId);
      newUser.following += 1;
      (usersStore.users.get(followId) as UserType).followers += 1;
    }

    await storeUser(newUser);
  } catch (error) {
    //
  }

  return json.user;
};
