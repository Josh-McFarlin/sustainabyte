import type { QueryFunction } from "react-query";
import urls from "../utils/urls";
import type { Recent } from "../types/Recent";
import type { Coordinates } from "../types/Location";

export const fetchRecent: QueryFunction<Recent[], [string, Coordinates]> =
  async ({ queryKey }): Promise<Recent[]> => {
    const [_key, coordinates] = queryKey;

    const response = await fetch(
      `${urls.api}/recent?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok!");
    }

    const json = await response.json();

    return json.recents;
  };
