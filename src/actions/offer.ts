import type { QueryFunction } from "react-query";
import { authRequest } from "../utils/request";
import urls from "../utils/urls";
import type { OfferType } from "../types/Offer";
import type { CoordinatesType } from "../types/Location";
import { uploadImage } from "../utils/image";

export const fetchOffers: QueryFunction<
  OfferType[],
  [
    string,
    CoordinatesType,
    {
      restaurant?: string;
      page?: number;
      perPage?: number;
    }
  ]
> = async ({ queryKey }): Promise<OfferType[]> => {
  const [_key, coordinates, params = {}] = queryKey;

  const { data: json } = await authRequest.get(`${urls.api}/offer`, {
    params: {
      ...params,
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

export const createOffer = async (
  offer: Pick<
    OfferType,
    "restaurant" | "photoUrl" | "title" | "body" | "prompt" | "expiresAt"
  >
): Promise<OfferType> => {
  const { data: json } = await authRequest.post(
    `${urls.api}/offer`,
    JSON.stringify({
      ...offer,
      photoUrl: null,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  await uploadImage(offer.photoUrl, json.uploadUrl);

  return json.offer;
};
