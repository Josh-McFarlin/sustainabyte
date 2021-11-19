import type { LocationType } from "./Location";
import type { SocialGroupType } from "./SocialGroup";

export interface UserType {
  _id: string;
  auth0Id: string;
  name: string;
  email: string;
  username: string;
  avatarUrl: string;
  bio?: string;
  score: number;
  locations: LocationType[];
  groups: SocialGroupType["_id"][];
  followers: number;
  following: number;
  saved: number;
  createdAt: Date;
}

export type BasicUserType = Pick<
  UserType,
  "_id" | "username" | "name" | "avatarUrl"
>;
