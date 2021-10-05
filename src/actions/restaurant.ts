import { createServer } from "miragejs";
import type { QueryFunction } from "react-query";
import type { Restaurant } from "../types/Restaurant";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (window.server) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  server.shutdown();
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.server = createServer({
  routes() {
    this.get(
      "/api/restaurants",
      (schema, request): { restaurants: Restaurant[] } => {
        const { latitude, longitude } = request.params;

        console.log("API Coordinates:", { latitude, longitude });

        return {
          restaurants: [
            {
              id: "1",
              name: "Herban Fix",
              description:
                "Pan-Asian dishes using strictly vegan, plant-based ingredients served in open, contemporary digs.",
              address: {
                street: "565 Peachtree St NE",
                city: "Atlanta",
                state: "GA",
                zipCode: 30308,
                country: "USA",
              },
              coordinates: {
                latitude: 33.770075,
                longitude: -84.3870526,
              },
              website: "http://www.herbanfix.com/",
              phoneNumber: "+14048158787",
            },
            {
              id: "2",
              name: "GOOD AS BURGERS",
              description:
                "GAB'S is known for revolutionizing and influencing the way people eat and enjoy food. Good As Burgers is the best Fast Food Vegan Restaurant in Atlanta.",
              address: {
                street: "800 Forrest St NW",
                city: "Atlanta",
                state: "GA",
                zipCode: 30318,
                country: "USA",
              },
              coordinates: {
                latitude: 33.7957732,
                longitude: -84.4164187,
              },
              website: "http://www.goodasburgers.com/",
              phoneNumber: "+16786059250",
            },
            {
              id: "3",
              name: "sweetgreen",
              description:
                "Locavore-friendly counter-serve chain specializing in organic salads, soup & bowls.",
              address: {
                street: "650 North Avenue NE Suite 102B",
                city: "Atlanta",
                state: "GA",
                zipCode: 30308,
                country: "USA",
              },
              coordinates: {
                latitude: 33.7714,
                longitude: -84.3689171,
              },
              website: "http://www.sweetgreen.com/",
              phoneNumber: "+17707668500",
            },
          ],
        };
      }
    );
  },
});

export const fetchRestaurants: QueryFunction<
  Restaurant[],
  [string, Coordinates]
> = async ({ queryKey }): Promise<Restaurant[]> => {
  const [_key, coordinates] = queryKey;

  const response = await fetch(
    `/api/restaurants?latitude=${coordinates.latitude},longitude=${coordinates.longitude}`
  );

  if (!response.ok) {
    throw new Error("Network response was not ok!");
  }

  const json = await response.json();

  return json.restaurants;
};
