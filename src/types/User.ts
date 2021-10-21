import type { Location } from "./Location";
import type { SocialGroup } from "./SocialGroup";

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  avatarUrl: string;
  score: number;
  locations: Location[];
  groups: SocialGroup[];
}
