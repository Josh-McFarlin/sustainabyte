import type { QueryFunction } from "react-query";
import { authRequest } from "../utils/request";
import urls from "../utils/urls";
import type { UserType } from "../types/User";
import usersStore, { storeUser } from "../utils/userData";
import { getContentType, requestUpload, uploadImage } from "../utils/image";

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

  const { users } = json;

  await Promise.all(users.map(storeUser));

  return users;
};

export const fetchUser: QueryFunction<UserType, [string, string]> = async ({
  queryKey,
}): Promise<UserType> => {
  const [_key, userId] = queryKey;

  try {
    usersStore.retrieving.add(userId);

    const { data: json } = await authRequest.get(
      `${urls.api}/user/${encodeURIComponent(userId)}`
    );

    const { data: followersJson } = await authRequest.get(
      `${urls.api}/follow`,
      {
        params: {
          toType: "User",
          to: json.user._id,
          simpleType: "from",
        },
      }
    );

    const { data: followingJson } = await authRequest.get(
      `${urls.api}/follow`,
      {
        params: {
          fromType: "User",
          from: json.user._id,
          simpleType: "to",
        },
      }
    );

    const user: UserType = {
      ...json.user,
      followers: new Set<UserType["_id"]>(followersJson.follows),
      following: new Set<UserType["_id"]>(followingJson.follows),
    };

    await storeUser(user);

    return user;
  } finally {
    usersStore.retrieving.delete(userId);
  }
};

export const updateUser = async (
  id: UserType["_id"],
  user: Partial<
    Pick<
      UserType,
      | "name"
      | "email"
      | "avatarUrl"
      | "locations"
      | "groups"
      | "followers"
      | "following"
      | "bio"
    >
  >
): Promise<UserType> => {
  const payload = {
    ...user,
  };

  if (user.avatarUrl != null) {
    const contentType = getContentType(user.avatarUrl);
    const upload = await requestUpload([contentType]);

    await uploadImage(user.avatarUrl, upload[0].uploadUrl);

    payload.avatarUrl = upload[0].fileUrl;
  }

  const { data: json } = await authRequest.put(
    `${urls.api}/user/${id}`,
    JSON.stringify(payload),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const newUser: UserType = <UserType>{
    ...usersStore.users.get(id),
  };

  Object.keys(user).forEach((field) => {
    newUser[field] = json.user[field];
  });

  await storeUser(newUser);

  return newUser;
};
