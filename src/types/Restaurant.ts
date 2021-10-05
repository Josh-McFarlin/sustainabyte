import type { Address, Coordinates } from "./Location";

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: Address;
  coordinates: Coordinates;
  website?: string;
  phoneNumber?: string;
}