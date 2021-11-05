import type { QueryFunction } from "react-query";
import urls from "../utils/urls";
import type { UserType } from "../types/User";

export const fetchUsers: QueryFunction<UserType[], [string]> =
  async (): Promise<UserType[]> => {
    const response = await fetch(`${urls.api}/user`);

    if (!response.ok) {
      throw new Error("Network response was not ok!");
    }

    const json = await response.json();

    return json.users;
  };

export const fetchUser: QueryFunction<UserType, [string, string]> = async ({
  queryKey,
}): Promise<UserType> => {
  const [_key, userId] = queryKey;

  const response = await fetch(`${urls.api}/user/${userId}`);

  if (!response.ok) {
    throw new Error("Network response was not ok!");
  }

  const json = await response.json();

  return json.user;
};

export const updateUser = async (user: UserType): Promise<UserType> => {
  const response = await fetch(`${urls.api}/user/${user.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok!");
  }

  const json = await response.json();

  return json.user;
};
