import type { QueryFunction } from "react-query";
import { authRequest } from "../utils/request";
import urls from "../utils/urls";
import type { SocialGroupType } from "../types/SocialGroup";
import type { CoordinatesType } from "../types/Location";
import { uploadImage } from "../utils/image";

export const fetchSocialGroups: QueryFunction<
  SocialGroupType[],
  [
    string,
    {
      coordinates?: CoordinatesType;
      name?: string;
      owner?: string;
      member?: string[];
      tags?: string[];
      page?: number;
      perPage?: number;
    }
  ]
> = async ({ queryKey }): Promise<SocialGroupType[]> => {
  const [_key, params = {}] = queryKey;

  const { data: json } = await authRequest.get(`${urls.api}/socialGroup`, {
    params,
  });

  return json.socialGroups;
};

export const fetchSocialGroup: QueryFunction<
  SocialGroupType,
  [string, string]
> = async ({ queryKey }): Promise<SocialGroupType> => {
  const [_key, socialGroupId] = queryKey;

  const { data: json } = await authRequest.get(
    `${urls.api}/socialGroup/${encodeURIComponent(socialGroupId)}`
  );

  return json.socialGroup;
};

export const createSocialGroup = async (
  socialGroup: Pick<
    SocialGroupType,
    "name" | "description" | "tags" | "iconUrl"
  >
): Promise<SocialGroupType> => {
  const { data: json } = await authRequest.post(
    `${urls.api}/socialGroup`,
    JSON.stringify({
      ...socialGroup,
      iconUrl: null,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  await uploadImage(socialGroup.iconUrl, json.uploadUrl);

  return json.socialGroup;
};
