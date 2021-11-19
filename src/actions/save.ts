import type { QueryFunction } from "react-query";
import { authRequest } from "../utils/request";
import urls from "../utils/urls";
import usersStore from "../utils/userData";
import { UserType } from "../types/User";
import { CheckInType } from "../types/CheckIn";
import { PostType } from "../types/Post";
import { ReviewType } from "../types/Review";
import { SaveRefType } from "../types/SaveRef";

export type SavesResponseType =
  | SaveRefType[]
  | (CheckInType | PostType | ReviewType)[]
  | string[];

export const fetchSavesById: QueryFunction<
  SavesResponseType,
  [
    string,
    {
      id: UserType["_id"];
      format?: "simple" | "detailed";
      filter?: "CheckIn" | "Post" | "Review";
    }
  ]
> = async ({ queryKey }): Promise<SavesResponseType> => {
  const [_key, params = {}] = queryKey;

  const { data: json } = await authRequest.get(`${urls.api}/save`, {
    params,
  });

  return json.saves;
};

export const toggleSave = async (
  contentType: "CheckIn" | "Post" | "Review",
  content: CheckInType["_id"] | PostType["_id"] | ReviewType["_id"]
): Promise<UserType> => {
  const { data: json } = await authRequest.post(
    `${urls.api}/save`,
    JSON.stringify({
      contentType,
      content,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  try {
    if (usersStore.saved.has(content)) {
      usersStore.saved.delete(content);
    } else {
      usersStore.saved.add(content);
    }
  } catch (error) {
    //
  }

  return json.user;
};
