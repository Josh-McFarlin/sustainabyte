import type { QueryFunction } from "react-query";
import type { Challenge } from "../types/Challenge";

export const fetchChallenges: QueryFunction<Challenge[], [string]> =
  async (): Promise<Challenge[]> => {
    const response = await fetch(`/api/challenge`);

    if (!response.ok) {
      throw new Error("Network response was not ok!");
    }

    const json = await response.json();

    return json.challenges;
  };

export const fetchChallenge: QueryFunction<Challenge, [string, string]> =
  async ({ queryKey }): Promise<Challenge> => {
    const [_key, challengeId] = queryKey;

    const response = await fetch(`/api/challenge/${challengeId}`);

    if (!response.ok) {
      throw new Error("Network response was not ok!");
    }

    const json = await response.json();

    return json.challenge;
  };
