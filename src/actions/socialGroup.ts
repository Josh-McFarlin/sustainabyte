import type { QueryFunction } from "react-query";
import axios from "axios";
import urls from "../utils/urls";
import type { SocialGroupType } from "../types/SocialGroup";
import type { CoordinatesType } from "../types/Location";

export const fetchSocialGroups: QueryFunction<
  SocialGroupType[],
  [string, CoordinatesType]
> = async ({ queryKey }): Promise<SocialGroupType[]> => {
  const [_key] = queryKey;

  const { data: json } = await axios.get(`${urls.api}/socialGroup`);

  return json.socialGroups;
};

export const fetchSocialGroup: QueryFunction<
  SocialGroupType,
  [string, string]
> = async ({ queryKey }): Promise<SocialGroupType> => {
  const [_key, socialGroupId] = queryKey;

  const { data: json } = await axios.get(
    `${urls.api}/socialGroup/${socialGroupId}`
  );

  return json.socialGroup;
};

export const createSocialGroup = async (
  socialGroup: SocialGroupType
): Promise<SocialGroupType> => {
  const { data: json } = await axios.post(
    `${urls.api}/socialGroup`,
    JSON.stringify(socialGroup),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return json.socialGroup;
};
