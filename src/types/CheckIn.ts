import type { Restaurant } from "./Restaurant";
import type { User } from "./User";

export interface CheckIn {
  id: string;
  user: User["id"];
  restaurant: Restaurant["id"];
  createdAt: number;
  withUsers: User["id"][];
}
