import type { LocationType } from "./Location";
import type { SocialGroupType } from "./SocialGroup";

export interface UserType {
  _id: string;
  auth0Id: string;
  name: string;
  email: string;
  username: string;
  avatarUrl: string;
  score: number;
  locations: LocationType[];
  groups: SocialGroupType["_id"][];
  followers: Set<UserType["_id"]>;
  following: Set<UserType["_id"]>;
  createdAt: Date;
}

export type BasicUserType = Pick<
  UserType,
  "_id" | "username" | "name" | "avatarUrl"
>;
