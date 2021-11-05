import type { UserType } from "./User";

export interface ChallengeType {
  id: string;
  owner: UserType["id"];
  name: string;
  body?: string;
  iconUrl: string;
  score: number;
  completedBy: UserType["id"][];
  createdAt: Date;
  expiresAt: Date;
}
