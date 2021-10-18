import type { Location } from "./Location";

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  avatarUrl: string;
  score: number;
  locations: Location[];
}
