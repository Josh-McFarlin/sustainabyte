import type { AddressType, CoordinatesType } from "./Location";

export interface DayAvailabilityType {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

export type OpenHoursType = [
  // Sunday
  DayAvailabilityType[],
  // Monday
  DayAvailabilityType[],
  // Tuesday
  DayAvailabilityType[],
  // Wednesday
  DayAvailabilityType[],
  // Thursday
  DayAvailabilityType[],
  // Friday
  DayAvailabilityType[],
  // Saturday
  DayAvailabilityType[]
];

export interface RestaurantType {
  _id: string;
  auth0Id: string;
  name: string;
  email: string;
  avatarUrl: string;
  headerUrl: string;
  bio?: string;
  tags: string[];
  openHours: OpenHoursType;
  address: AddressType;
  coordinates: CoordinatesType;
  website?: string;
  phoneNumber?: string;
  ratings: {
    count: number;
    sum: number;
  };
  menuPercents: Record<string, number>;
  createdAt: Date;
}
