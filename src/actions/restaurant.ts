import type { QueryFunction } from "react-query";
import type { Restaurant } from "../types/Restaurant";

export const fetchRestaurants: QueryFunction<
  Restaurant[],
  [string, Coordinates]
> = async ({ queryKey }): Promise<Restaurant[]> => {
  const [_key, coordinates] = queryKey;

  const response = await fetch(
    `/api/restaurant?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}`
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

    const response = await fetch(`/api/restaurant/${restaurantId}`);

    if (!response.ok) {
      throw new Error("Network response was not ok!");
    }

    const json = await response.json();

    return json.restaurant;
  };
