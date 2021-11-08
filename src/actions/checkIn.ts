import type { QueryFunction } from "react-query";
import { authRequest } from "../utils/request";
import urls from "../utils/urls";
import type { CheckInType } from "../types/CheckIn";

export const fetchCheckIns: QueryFunction<
  CheckInType[],
  [
    string,
    {
      user?: string;
      restaurant?: string;
      tags?: string[];
      page?: number;
      perPage?: number;
    }
  ]
> = async ({ queryKey }): Promise<CheckInType[]> => {
  const [_key, params = {}] = queryKey;
  const { data: json } = await authRequest.get(`${urls.api}/checkIn`, {
    params,
  });

  return json.checkIns;
};

export const fetchCheckIn: QueryFunction<CheckInType, [string, string]> =
  async ({ queryKey }): Promise<CheckInType> => {
    const [_key, checkInId] = queryKey;

    const { data: json } = await authRequest.get(
      `${urls.api}/checkIn/${encodeURIComponent(checkInId)}`
    );

    return json.checkIn;
  };

export const createCheckIn = async (
  checkIn: Pick<CheckInType, "restaurant" | "withUsers">
): Promise<CheckInType> => {
  const { data: json } = await authRequest.post(
    `${urls.api}/checkIn`,
    JSON.stringify(checkIn),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return json.checkIn;
};
