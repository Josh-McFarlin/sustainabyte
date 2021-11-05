import type { QueryFunction } from "react-query";
import urls from "../utils/urls";
import type { Restaurant } from "../types/Restaurant";
import type { Coordinates } from "../types/Location";

export const fetchRestaurants: QueryFunction<
  Restaurant[],
  [string, Coordinates]
> = async ({ queryKey }): Promise<Restaurant[]> => {
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

export const fetchRestaurant: QueryFunction<Restaurant, [string, string]> =
  async ({ queryKey }): Promise<Restaurant> => {
    const [_key, restaurantId] = queryKey;

    const response = await fetch(`${urls.api}/restaurant/${restaurantId}`);

    if (!response.ok) {
      throw new Error("Network response was not ok!");
    }

    const json = await response.json();

    return json.restaurant;
  };

export const updateRestaurant = async (restaurant: Restaurant) => {
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
