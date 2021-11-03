import type { User } from "./User";

export interface Challenge {
  id: string;
  title: string;
  body: string;
  icon: string;
  createdAt: number;
  expiresAt: number;
  score: number;
  completedBy: User["id"][];
}
