import type { Address, Coordinates } from "./Location";

export interface Restaurant {
  id: string;
  name: string;
  avatarUrl: string;
  description: string;
  tags: string[];
  numCrowns: number;
  address: Address;
  coordinates: Coordinates;
  website?: string;
  phoneNumber?: string;
}
