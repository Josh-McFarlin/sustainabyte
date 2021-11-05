import type { LocationType } from "./Location";
import type { SocialGroupType } from "./SocialGroup";

export interface UserType {
  id: string;
  auth0Id: string;
  name: string;
  email: string;
  username: string;
  avatarUrl: string;
  score: number;
  locations: LocationType[];
  groups: SocialGroupType["id"][];
  followers: UserType["id"][];
  following: UserType["id"][];
  createdAt: Date;
}
