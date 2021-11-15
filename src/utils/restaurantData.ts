import { store, autoEffect } from "@risingstack/react-easy-state";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BasicRestaurantType, RestaurantType } from "../types/Restaurant";
import { fetchRestaurant } from "../actions/restaurant";

const restaurantsKey = "RESTAURANTS";
const restaurantKey = (restaurantId: RestaurantType["_id"]) =>
  `${restaurantsKey}-${restaurantId}`;

const restaurantsStore = store({
  restaurants: new Map<
    RestaurantType["_id"],
    BasicRestaurantType | RestaurantType
  >(),
  retrieving: new Set<RestaurantType["_id"]>(),
  retrieved: new Set<RestaurantType["_id"]>(),
  get(restaurantId: RestaurantType["_id"]): BasicRestaurantType | null {
    if (
      !restaurantsStore.retrieving.has(restaurantId) &&
      !restaurantsStore.retrieved.has(restaurantId)
    ) {
      fetchRestaurant({
        queryKey: ["", restaurantId],
        meta: {},
      });
    }

    if (restaurantsStore.restaurants.has(restaurantId)) {
      const restaurant = restaurantsStore.restaurants.get(restaurantId);

      return {
        _id: restaurant._id,
        name: restaurant.name,
        avatarUrl: restaurant.avatarUrl,
        headerUrl: restaurant.headerUrl,
        tags: restaurant.tags,
        ratings: restaurant.ratings,
        menuPercents: restaurant.menuPercents,
      };
    }

    return null;
  },
  getFull(
    restaurantId: RestaurantType["_id"]
  ): RestaurantType | BasicRestaurantType | null {
    if (
      !restaurantsStore.retrieving.has(restaurantId) &&
      !restaurantsStore.retrieved.has(restaurantId)
    ) {
      fetchRestaurant({
        queryKey: ["", restaurantId],
        meta: {},
      });
    }

    if (restaurantsStore.restaurants.has(restaurantId)) {
      return restaurantsStore.restaurants.get(restaurantId);
    }

    return null;
  },
});

autoEffect(async () => {
  const stored = await AsyncStorage.getItem(restaurantsKey);

  if (stored != null) {
    const restaurantIds: BasicRestaurantType["_id"][] = JSON.parse(stored);

    await Promise.all(
      restaurantIds.map(async (restaurantId) => {
        try {
          const restaurantStr = await AsyncStorage.getItem(
            restaurantKey(restaurantId)
          );

          if (restaurantStr != null) {
            const restaurant: BasicRestaurantType = JSON.parse(restaurantStr);

            restaurantsStore.restaurants.set(restaurant._id, restaurant);
          }
        } catch (error) {
          console.error(`Failed loading restaurant: ${restaurantId}`);
        }
      })
    );
  }
});

export const storeRestaurant = async (
  restaurant: RestaurantType
): Promise<void> => {
  restaurantsStore.retrieved.add(restaurant._id);
  restaurantsStore.restaurants.set(restaurant._id, restaurant);
  await AsyncStorage.setItem(
    restaurantKey(restaurant._id),
    JSON.stringify({
      _id: restaurant._id,
      name: restaurant.name,
      avatarUrl: restaurant.avatarUrl,
      headerUrl: restaurant.headerUrl,
      tags: restaurant.tags,
      ratings: restaurant.ratings,
      menuPercents: restaurant.menuPercents,
    })
  );
  await AsyncStorage.setItem(
    restaurantsKey,
    JSON.stringify([...restaurantsStore.restaurants.keys()])
  );
};

export default restaurantsStore;
