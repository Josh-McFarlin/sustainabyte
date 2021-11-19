import type { QueryFunction } from "react-query";
import { authRequest } from "../utils/request";
import urls from "../utils/urls";
import type { UserType } from "../types/User";
import usersStore, { storeUser } from "../utils/userData";

export const fetchAuth: QueryFunction<UserType, [string, string]> = async ({
  queryKey,
}): Promise<UserType> => {
  const [_key, id] = queryKey;

  try {
    usersStore.retrieving.add(id);

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

    const user: UserType = {
      ...json.auth,
    };

    await storeUser(user);

    return user;
  } finally {
    usersStore.retrieving.delete(id);
  }
};
