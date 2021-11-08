import type { QueryFunction } from "react-query";
import { authRequest } from "../utils/request";
import urls from "../utils/urls";
import type { ChallengeType } from "../types/Challenge";
import { uploadImage } from "../utils/image";

export const fetchChallenges: QueryFunction<
  ChallengeType[],
  [
    string,
    {
      name?: string;
      user?: string;
      owner?: string;
      page?: number;
      perPage?: number;
    }
  ]
> = async ({ queryKey }): Promise<ChallengeType[]> => {
  const [_key, params = {}] = queryKey;
  const { data: json } = await authRequest.get(`${urls.api}/challenge`, {
    params,
  });

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
  challenge: Pick<
    ChallengeType,
    "name" | "body" | "iconUrl" | "score" | "expiresAt"
  >
): Promise<ChallengeType> => {
  const { data: json } = await authRequest.post(
    `${urls.api}/challenge`,
    JSON.stringify({
      ...challenge,
      iconUrl: null,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  await uploadImage(challenge.iconUrl, json.uploadUrl);

  return json.challenge;
};
