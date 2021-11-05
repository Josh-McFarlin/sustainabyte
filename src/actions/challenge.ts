import type { QueryFunction } from "react-query";
import urls from "../utils/urls";
import type { ChallengeType } from "../types/Challenge";

export const fetchChallenges: QueryFunction<ChallengeType[], [string]> =
  async (): Promise<ChallengeType[]> => {
    const response = await fetch(`${urls.api}/challenge`);

    if (!response.ok) {
      throw new Error("Network response was not ok!");
    }

    const json = await response.json();

    return json.challenges;
  };

export const fetchChallenge: QueryFunction<ChallengeType, [string, string]> =
  async ({ queryKey }): Promise<ChallengeType> => {
    const [_key, challengeId] = queryKey;

    const response = await fetch(`${urls.api}/challenge/${challengeId}`);

    if (!response.ok) {
      throw new Error("Network response was not ok!");
    }

    const json = await response.json();

    return json.challenge;
  };

export const createChallenge = async (
  challenge: ChallengeType
): Promise<ChallengeType> => {
  const response = await fetch(`${urls.api}/challenge`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(challenge),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok!");
  }

  const json = await response.json();

  return json.challenge;
};
