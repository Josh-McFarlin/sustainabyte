import type { Address, Coordinates } from "./Location";

export interface Restaurant {
  id: string;
  name: string;
  avatarUrl: string;
  headerUrl: string;
  description: string;
  tags: string[];
  address: Address;
  coordinates: Coordinates;
  website?: string;
  phoneNumber?: string;
  ratings: {
    sum: number;
    count: number;
  };
  sustainability: {
    vegan: number;
    vegetarian: number;
  };
}
