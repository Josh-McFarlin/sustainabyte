import type { QueryFunction } from "react-query";
import urls from "../utils/urls";
import type { CheckIn } from "../types/CheckIn";

export const fetchCheckIns: QueryFunction<CheckIn[], [string]> =
  async (): Promise<CheckIn[]> => {
    const response = await fetch(`${urls.api}/checkIn`);

    if (!response.ok) {
      throw new Error("Network response was not ok!");
    }

    const json = await response.json();

    return json.checkIns;
  };

export const fetchCheckIn: QueryFunction<CheckIn, [string, string]> = async ({
  queryKey,
}): Promise<CheckIn> => {
  const [_key, checkInId] = queryKey;

  const response = await fetch(`${urls.api}/checkIn/${checkInId}`);

  if (!response.ok) {
    throw new Error("Network response was not ok!");
  }

  const json = await response.json();

  return json.checkIn;
};

export const createCheckIn = async (checkIn: CheckIn) => {
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
