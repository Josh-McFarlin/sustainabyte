import type { QueryFunction } from "react-query";
import { authRequest } from "../utils/request";
import urls from "../utils/urls";
import type { RecentType } from "../types/Recent";
import type { CoordinatesType } from "../types/Location";

export const fetchRecent: QueryFunction<
  RecentType[],
  [string, CoordinatesType]
> = async ({ queryKey }): Promise<RecentType[]> => {
  const [_key, coordinates] = queryKey;

  const { data: json } = await authRequest.get(`${urls.api}/recent`, {
    params: {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    },
  });

  return json.recent;
};
