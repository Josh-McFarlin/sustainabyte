import type { QueryFunction } from "react-query";
import type { SocialGroup } from "../types/SocialGroup";

export const fetchSocialGroups: QueryFunction<
  SocialGroup[],
  [string, Coordinates]
> = async ({ queryKey }): Promise<SocialGroup[]> => {
  const [_key] = queryKey;

  const response = await fetch(`/api/socialGroup`);

  if (!response.ok) {
    throw new Error("Network response was not ok!");
  }

  const json = await response.json();

  return json.socialGroups;
};

export const fetchSocialGroup: QueryFunction<SocialGroup, [string, string]> =
  async ({ queryKey }): Promise<SocialGroup> => {
    const [_key, socialGroupId] = queryKey;

    const response = await fetch(`/api/socialGroup/${socialGroupId}`);

    if (!response.ok) {
      throw new Error("Network response was not ok!");
    }

    const json = await response.json();

    return json.socialGroup;
  };
