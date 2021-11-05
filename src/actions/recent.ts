import type { QueryFunction } from "react-query";
import urls from "../utils/urls";
import type { RecentType } from "../types/Recent";
import type { CoordinatesType } from "../types/Location";

export const fetchRecent: QueryFunction<
  RecentType[],
  [string, CoordinatesType]
> = async ({ queryKey }): Promise<RecentType[]> => {
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
