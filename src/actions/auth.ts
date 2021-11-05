import type { QueryFunction } from "react-query";
import axios from "axios";
import urls from "../utils/urls";
import type { UserType } from "../types/User";

export const fetchAuth: QueryFunction<UserType, [string, string]> = async ({
  queryKey,
}): Promise<UserType> => {
  const [_key, id] = queryKey;

  const { data: json } = await axios.get(`${urls.api}/auth/${id}?type=USER`);

  return json.auth;
};
