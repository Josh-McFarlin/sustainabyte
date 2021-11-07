import type { QueryFunction } from "react-query";
import { authRequest } from "../utils/request";
import urls from "../utils/urls";
import type { ChallengeType } from "../types/Challenge";

export const fetchChallenges: QueryFunction<ChallengeType[], [string]> =
  async (): Promise<ChallengeType[]> => {
    const { data: json } = await authRequest.get(`${urls.api}/challenge`);

    return json.challenges;
  };

export const fetchChallenge: QueryFunction<ChallengeType, [string, string]> =
  async ({ queryKey }): Promise<ChallengeType> => {
    const [_key, challengeId] = queryKey;

    const { data: json } = await authRequest.get(
      `${urls.api}/challenge/${encodeURIComponent(challengeId)}`
    );

    return json.challenge;
  };

export const createChallenge = async (
  challenge: ChallengeType
): Promise<ChallengeType> => {
  const { data: json } = await authRequest.post(
    `${urls.api}/challenge`,
    JSON.stringify(challenge),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return json.challenge;
};
