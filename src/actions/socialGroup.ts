import type { QueryFunction } from "react-query";
import urls from "../utils/urls";
import type { SocialGroup } from "../types/SocialGroup";
import type { Coordinates } from "../types/Location";

export const fetchSocialGroups: QueryFunction<
  SocialGroup[],
  [string, Coordinates]
> = async ({ queryKey }): Promise<SocialGroup[]> => {
  const [_key] = queryKey;

  const response = await fetch(`${urls.api}/socialGroup`);

  if (!response.ok) {
    throw new Error("Network response was not ok!");
  }

  const json = await response.json();

  return json.socialGroups;
};

export const fetchSocialGroup: QueryFunction<SocialGroup, [string, string]> =
  async ({ queryKey }): Promise<SocialGroup> => {
    const [_key, socialGroupId] = queryKey;

    const response = await fetch(`${urls.api}/socialGroup/${socialGroupId}`);

    if (!response.ok) {
      throw new Error("Network response was not ok!");
    }

    const json = await response.json();

    return json.socialGroup;
  };

export const createSocialGroup = async (
  socialGroup: SocialGroup
): Promise<SocialGroup> => {
  const response = await fetch(`${urls.api}/socialGroup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(socialGroup),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok!");
  }

  const json = await response.json();

  return json.socialGroup;
};
