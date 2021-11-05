import type { QueryFunction } from "react-query";
import urls from "../utils/urls";
import type { Offer } from "../types/Offer";
import type { Coordinates } from "../types/Location";

export const fetchOffers: QueryFunction<Offer[], [string, Coordinates]> =
  async ({ queryKey }): Promise<Offer[]> => {
    const [_key, coordinates] = queryKey;

    const response = await fetch(
      `${urls.api}/offer?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}`
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

  const response = await fetch(`${urls.api}/offer/${offerId}`);

  if (!response.ok) {
    throw new Error("Network response was not ok!");
  }

  const json = await response.json();

  return json.offer;
};

export const createOffer = async (offer: Offer) => {
  const response = await fetch(`${urls.api}/offer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(offer),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok!");
  }

  const json = await response.json();

  return json.offer;
};
