import type { Address, Coordinates } from "./Location";

export interface DayAvailability {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

export type OpenHours = [
  // Sunday
  DayAvailability[],
  // Monday
  DayAvailability[],
  // Tuesday
  DayAvailability[],
  // Wednesday
  DayAvailability[],
  // Thursday
  DayAvailability[],
  // Friday
  DayAvailability[],
  // Saturday
  DayAvailability[]
];

export interface Restaurant {
  id: string;
  name: string;
  avatarUrl: string;
  headerUrl: string;
  description: string;
  tags: string[];
  openHours: OpenHours;
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
