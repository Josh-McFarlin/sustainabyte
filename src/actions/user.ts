import type { QueryFunction } from "react-query";
import axios from "axios";
import urls from "../utils/urls";
import type { UserType } from "../types/User";

export const fetchUsers: QueryFunction<UserType[], [string]> =
  async (): Promise<UserType[]> => {
    const { data: json } = await axios.get(`${urls.api}/user`);

    return json.users;
  };

export const fetchUser: QueryFunction<UserType, [string, string]> = async ({
  queryKey,
}): Promise<UserType> => {
  const [_key, userId] = queryKey;

  const { data: json } = await axios.get(`${urls.api}/user/${userId}`);

  return json.user;
};

export const updateUser = async (user: UserType): Promise<UserType> => {
  const { data: json } = await axios.put(
    `${urls.api}/user/${user.id}`,
    JSON.stringify(user),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return json.user;
};
