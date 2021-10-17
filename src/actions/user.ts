import type { QueryFunction } from "react-query";
import type { User } from "../types/User";

export const fetchUsers: QueryFunction<User[], [string]> = async (): Promise<
  User[]
> => {
  const response = await fetch(`/api/user`);

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

  const response = await fetch(`/api/user/${userId}`);

  if (!response.ok) {
    throw new Error("Network response was not ok!");
  }

  const json = await response.json();

  return json.user;
};
