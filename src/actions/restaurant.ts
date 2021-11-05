import type { QueryFunction } from "react-query";
import urls from "../utils/urls";
import type { RestaurantType } from "../types/Restaurant";
import type { CoordinatesType } from "../types/Location";

export const fetchRestaurants: QueryFunction<
  RestaurantType[],
  [string, CoordinatesType]
> = async ({ queryKey }): Promise<RestaurantType[]> => {
  const [_key, coordinates] = queryKey;

  const response = await fetch(
    `${urls.api}/restaurant?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}`
  );

  if (!response.ok) {
    throw new Error("Network response was not ok!");
  }

  const json = await response.json();

  return json.restaurants;
};

export const fetchRestaurant: QueryFunction<RestaurantType, [string, string]> =
  async ({ queryKey }): Promise<RestaurantType> => {
    const [_key, restaurantId] = queryKey;

    const response = await fetch(`${urls.api}/restaurant/${restaurantId}`);

    if (!response.ok) {
      throw new Error("Network response was not ok!");
    }

    const json = await response.json();

    return json.restaurant;
  };

export const updateRestaurant = async (
  restaurant: RestaurantType
): Promise<RestaurantType> => {
  const response = await fetch(`${urls.api}/restaurant/${restaurant.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(restaurant),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok!");
  }

  const json = await response.json();

  return json.restaurant;
};
