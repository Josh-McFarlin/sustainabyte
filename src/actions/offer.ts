import type { QueryFunction } from "react-query";
import type { Offer } from "../types/Offer";

export const fetchOffers: QueryFunction<Offer[], [string, Coordinates]> =
  async ({ queryKey }): Promise<Offer[]> => {
    const [_key, coordinates] = queryKey;

    const response = await fetch(
      `/api/offer?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok!");
    }

    const json = await response.json();

    return json.offers;
  };

export const fetchOffer: QueryFunction<Offer, [string, string]> = async ({
  queryKey,
}): Promise<Offer> => {
  const [_key, offerId] = queryKey;

  const response = await fetch(`/api/offer/${offerId}`);

  if (!response.ok) {
    throw new Error("Network response was not ok!");
  }

  const json = await response.json();

  return json.offer;
};
