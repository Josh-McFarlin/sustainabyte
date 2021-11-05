import type { QueryFunction } from "react-query";
import urls from "../utils/urls";
import type { UserType } from "../types/User";

export const fetchAuth: QueryFunction<UserType, [string, string]> = async ({
  queryKey,
}): Promise<UserType> => {
  const [_key, id] = queryKey;

  const response = await fetch(`${urls.api}/auth/${id}?type=USER`);

  if (!response.ok) {
    throw new Error("Network response was not ok!");
  }

  const json = await response.json();

  return json.auth;
};
