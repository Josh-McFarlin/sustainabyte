import type { QueryFunction } from "react-query";
import { authRequest } from "../utils/request";
import urls from "../utils/urls";
import type { CheckInType } from "../types/CheckIn";

export const fetchCheckIns: QueryFunction<CheckInType[], [string]> =
  async (): Promise<CheckInType[]> => {
    const { data: json } = await authRequest.get(`${urls.api}/checkIn`);

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
  checkIn: CheckInType
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
