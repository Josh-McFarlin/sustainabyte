import type { QueryFunction } from "react-query";
import axios from "axios";
import urls from "../utils/urls";
import type { OfferType } from "../types/Offer";
import type { CoordinatesType } from "../types/Location";

export const fetchOffers: QueryFunction<
  OfferType[],
  [string, CoordinatesType]
> = async ({ queryKey }): Promise<OfferType[]> => {
  const [_key, coordinates] = queryKey;

  const { data: json } = await axios.get(
    `${urls.api}/offer?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}`
  );

  return json.offers;
};

export const fetchOffer: QueryFunction<OfferType, [string, string]> = async ({
  queryKey,
}): Promise<OfferType> => {
  const [_key, offerId] = queryKey;

  const { data: json } = await axios.get(`${urls.api}/offer/${offerId}`);

  return json.offer;
};

export const createOffer = async (offer: OfferType): Promise<OfferType> => {
  const { data: json } = await axios.post(
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
