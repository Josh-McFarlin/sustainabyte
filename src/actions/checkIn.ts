import type { QueryFunction } from "react-query";
import urls from "../utils/urls";
import type { CheckInType } from "../types/CheckIn";

export const fetchCheckIns: QueryFunction<CheckInType[], [string]> =
  async (): Promise<CheckInType[]> => {
    const response = await fetch(`${urls.api}/checkIn`);

    if (!response.ok) {
      throw new Error("Network response was not ok!");
    }

    const json = await response.json();

    return json.checkIns;
  };

export const fetchCheckIn: QueryFunction<CheckInType, [string, string]> =
  async ({ queryKey }): Promise<CheckInType> => {
    const [_key, checkInId] = queryKey;

    const response = await fetch(`${urls.api}/checkIn/${checkInId}`);

    if (!response.ok) {
      throw new Error("Network response was not ok!");
    }

    const json = await response.json();

    return json.checkIn;
  };

export const createCheckIn = async (
  checkIn: CheckInType
): Promise<CheckInType> => {
  const response = await fetch(`${urls.api}/checkIn`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(checkIn),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok!");
  }

  const json = await response.json();

  return json.checkIn;
};
