import type { QueryFunction } from "react-query";
import { authRequest } from "../utils/request";
import urls from "../utils/urls";
import type { FollowType } from "../types/Follow";
import usersStore from "../utils/userData";
import restaurantsStore from "../utils/restaurantData";
import { UserType } from "../types/User";

export const fetchFollows: QueryFunction<
  FollowType[],
  [
    string,
    Partial<FollowType> & {
      page?: number;
      perPage?: number;
    }
  ]
> = async ({ queryKey }): Promise<FollowType[]> => {
  const [_key, params = {}] = queryKey;

  const { data: json } = await authRequest.get(`${urls.api}/follow`, {
    params,
  });

  return json.follows;
};

export const createFollow = async (
  follow: Pick<FollowType, "fromType" | "toType" | "to">
): Promise<FollowType> => {
  const { data: json } = await authRequest.post(
    `${urls.api}/follow`,
    JSON.stringify({
      ...follow,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const from =
    json.follow.fromType === "User"
      ? usersStore.users.get(json.follow.from)
      : restaurantsStore.restaurants.get(json.follow.from);
  const to =
    json.follow.toType === "User"
      ? usersStore.users.get(json.follow.to)
      : restaurantsStore.restaurants.get(json.follow.to);

  try {
    (from as UserType).following.add(to._id);
    (to as UserType).followers.add(from._id);
  } catch (error) {
    //
  }

  return json.follow;
};

export const deleteFollow = async (
  followId: FollowType["_id"]
): Promise<FollowType> => {
  const { data: json } = await authRequest.delete(
    `${urls.api}/follow/${followId}`
  );

  return json.follow;
};
