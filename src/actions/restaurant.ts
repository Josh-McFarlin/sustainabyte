import type { QueryFunction } from "react-query";
import { authRequest } from "../utils/request";
import urls from "../utils/urls";
import type { RestaurantType } from "../types/Restaurant";
import type { CoordinatesType } from "../types/Location";
import restaurantsStore, { storeRestaurant } from "../utils/restaurantData";
import { UserType } from "../types/User";

export const fetchRestaurants: QueryFunction<
  RestaurantType[],
  [
    string,
    CoordinatesType,
    {
      name?: string;
      tags?: string[];
      page?: number;
      perPage?: number;
    }
  ]
> = async ({ queryKey }): Promise<RestaurantType[]> => {
  const [_key, coordinates, params = {}] = queryKey;

  const { data: json } = await authRequest.get(`${urls.api}/restaurant`, {
    params: {
      ...params,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    },
  });

  const { restaurants } = json;

  await Promise.all(restaurants.map(storeRestaurant));

  return restaurants;
};

export const fetchRestaurant: QueryFunction<RestaurantType, [string, string]> =
  async ({ queryKey }): Promise<RestaurantType> => {
    const [_key, restaurantId] = queryKey;

    try {
      restaurantsStore.retrieving.add(restaurantId);

      const { data: json } = await authRequest.get(
        `${urls.api}/restaurant/${encodeURIComponent(restaurantId)}`
      );

      const restaurant: RestaurantType = {
        ...json.restaurant,
      };

      await storeRestaurant(restaurant);

      return restaurant;
    } finally {
      restaurantsStore.retrieving.delete(restaurantId);
    }
  };

export const updateRestaurant = async (
  restaurant: Pick<
    RestaurantType,
    | "name"
    | "avatarUrl"
    | "headerUrl"
    | "bio"
    | "tags"
    | "openHours"
    | "address"
    | "coordinates"
    | "website"
    | "phoneNumber"
  >
): Promise<RestaurantType> => {
  const { data: json } = await authRequest.put(
    `${urls.api}/restaurant`,
    JSON.stringify(restaurant),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const newRestaurant = json.restaurant;

  await storeRestaurant(newRestaurant);

  return newRestaurant;
};
