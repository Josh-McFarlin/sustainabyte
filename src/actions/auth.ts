import type { QueryFunction } from "react-query";
import urls from "../utils/urls";
import type { Offer } from "../types/Offer";

export const fetchAuth: QueryFunction<Offer, [string, string]> = async ({
  queryKey,
}): Promise<Offer> => {
  const [_key, id] = queryKey;

  const response = await fetch(`${urls.api}/auth/${id}?type=USER`);

  if (!response.ok) {
    throw new Error("Network response was not ok!");
  }

  const json = await response.json();

  return json.offer;
};
