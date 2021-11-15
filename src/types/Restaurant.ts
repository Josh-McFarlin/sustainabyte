import type { AddressType, PointType } from "./Location";
import { UserType } from "./User";

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
  coordinates: PointType;
  website?: string;
  phoneNumber?: string;
  ratings: {
    count: number;
    sum: number;
  };
  menuPercents: Record<string, number>;
  followers: Set<UserType["_id"]>;
  createdAt: Date;
}

export type BasicRestaurantType = Pick<
  RestaurantType,
  | "_id"
  | "name"
  | "avatarUrl"
  | "headerUrl"
  | "tags"
  | "ratings"
  | "menuPercents"
>;
