import type { QueryFunction } from "react-query";
import { authRequest } from "../utils/request";
import urls from "../utils/urls";
import type { OfferType } from "../types/Offer";
import type { CoordinatesType } from "../types/Location";

export const fetchOffers: QueryFunction<
  OfferType[],
  [string, CoordinatesType]
> = async ({ queryKey }): Promise<OfferType[]> => {
  const [_key, coordinates] = queryKey;

  const { data: json } = await authRequest.get(`${urls.api}/offer`, {
    params: {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    },
  });

  return json.offers;
};

export const fetchOffer: QueryFunction<OfferType, [string, string]> = async ({
  queryKey,
}): Promise<OfferType> => {
  const [_key, offerId] = queryKey;

  const { data: json } = await authRequest.get(
    `${urls.api}/offer/${encodeURIComponent(offerId)}`
  );

  return json.offer;
};

export const createOffer = async (offer: OfferType): Promise<OfferType> => {
  const { data: json } = await authRequest.post(
    `${urls.api}/offer`,
    JSON.stringify(offer),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return json.offer;
};
