import type { UserType } from "./User";

export interface ChallengeType {
  _id: string;
  owner: UserType["_id"];
  name: string;
  body?: string;
  iconUrl: string;
  score: number;
  completedBy: UserType["_id"][];
  createdAt: Date;
  expiresAt: Date;
}
