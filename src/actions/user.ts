import type { QueryFunction } from "react-query";
import urls from "../utils/urls";
import type { User } from "../types/User";

export const fetchUsers: QueryFunction<User[], [string]> = async (): Promise<
  User[]
> => {
  const response = await fetch(`${urls.api}/user`);

  if (!response.ok) {
    throw new Error("Network response was not ok!");
  }

  const json = await response.json();

  return json.users;
};

export const fetchUser: QueryFunction<User, [string, string]> = async ({
  queryKey,
}): Promise<User> => {
  const [_key, userId] = queryKey;

  const response = await fetch(`${urls.api}/user/${userId}`);

  if (!response.ok) {
    throw new Error("Network response was not ok!");
  }

  const json = await response.json();

  return json.user;
};

export const updateUser = async (user: User): Promise<User> => {
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
