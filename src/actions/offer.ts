import type { QueryFunction } from "react-query";
import urls from "../utils/urls";
import type { OfferType } from "../types/Offer";
import type { CoordinatesType } from "../types/Location";

export const fetchOffers: QueryFunction<
  OfferType[],
  [string, CoordinatesType]
> = async ({ queryKey }): Promise<OfferType[]> => {
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

export const fetchOffer: QueryFunction<OfferType, [string, string]> = async ({
  queryKey,
}): Promise<OfferType> => {
  const [_key, offerId] = queryKey;

  const response = await fetch(`${urls.api}/offer/${offerId}`);

  if (!response.ok) {
    throw new Error("Network response was not ok!");
  }

  const json = await response.json();

  return json.offer;
};

export const createOffer = async (offer: OfferType): Promise<OfferType> => {
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
