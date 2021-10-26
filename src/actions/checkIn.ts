import type { QueryFunction } from "react-query";
import type { CheckIn } from "../types/CheckIn";

export const fetchCheckIns: QueryFunction<CheckIn[], [string]> =
  async (): Promise<CheckIn[]> => {
    const response = await fetch(`/api/checkIn`);

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

  const response = await fetch(`/api/checkIn/${checkInId}`);

  if (!response.ok) {
    throw new Error("Network response was not ok!");
  }

  const json = await response.json();

  return json.checkIn;
};
