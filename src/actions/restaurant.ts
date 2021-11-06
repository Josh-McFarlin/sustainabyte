import type { QueryFunction } from "react-query";
import { authRequest } from "../utils/request";
import urls from "../utils/urls";
import type { RestaurantType } from "../types/Restaurant";
import type { CoordinatesType } from "../types/Location";

export const fetchRestaurants: QueryFunction<
  RestaurantType[],
  [string, CoordinatesType]
> = async ({ queryKey }): Promise<RestaurantType[]> => {
  const [_key, coordinates] = queryKey;

  const { data: json } = await authRequest.get(
    `${urls.api}/restaurant?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}`
  );

  return json.restaurants;
};

export const fetchRestaurant: QueryFunction<RestaurantType, [string, string]> =
  async ({ queryKey }): Promise<RestaurantType> => {
    const [_key, restaurantId] = queryKey;

    const { data: json } = await authRequest.get(
      `${urls.api}/restaurant/${restaurantId}`
    );

    return json.restaurant;
  };

export const updateRestaurant = async (
  restaurant: RestaurantType
): Promise<RestaurantType> => {
  const { data: json } = await authRequest.put(
    `${urls.api}/restaurant/${restaurant.id}`,
    JSON.stringify(restaurant),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return json.restaurant;
};
