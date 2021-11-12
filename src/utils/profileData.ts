import { store, autoEffect } from "@risingstack/react-easy-state";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserType } from "../types/User";
import { authRequest } from "./request";
import urls from "./urls";

type BasicUserInfoType = Pick<
  UserType,
  "_id" | "username" | "name" | "avatarUrl"
>;

interface ProfileData {
  users: Map<UserType["_id"], UserType>;
}

const usersKey = "USERS";
const userKey = (userId: UserType["_id"]) => `${usersKey}-${userId}`;

const storeUser = async (user: UserType): Promise<void> => {
  await AsyncStorage.setItem(
    userKey(user._id),
    JSON.stringify({
      _id: user._id,
      username: user.username,
      name: user.name,
      avatarUrl: user.avatarUrl,
    })
  );
};

const fetchUser = async (userId: UserType["_id"]): Promise<UserType> => {
  const { data: json } = await authRequest.get(
    `${urls.api}/user/${encodeURIComponent(userId)}`
  );

  const { user } = json;
  await storeUser(user);

  return user;
};

export const usersStore = store({
  users: new Map<UserType["_id"], UserType>(),
  retrieved: new Set<UserType["_id"]>(),
  async get(userId: UserType["_id"]) {
    if (!usersStore.retrieved.has())
      if (usersStore.users.has(userId)) {
        //
      }

    return "bar";
  },
});

autoEffect(async () => {
  const stored = await AsyncStorage.getItem(usersKey);

  if (stored != null) {
    const userIds: BasicUserInfoType["_id"][] = JSON.parse(stored);

    await Promise.allSettled(
      userIds.map(async (userId) => {
        const userStr = await AsyncStorage.getItem(userKey(userId));

        if (userStr != null) {
          const user: BasicUserInfoType = JSON.parse(userStr);

          usersStore.users.set(user._id, user);
        }
      })
    );
  }
}, []);

export async function useUser(
  userId: UserType["_id"],
  full: true
): Promise<UserType>;
export async function useUser(
  userId: UserType["_id"],
  full: false
): Promise<BasicUserInfoType>;
export async function useUser(
  userId: UserType["_id"],
  full = false
): Promise<UserType | BasicUserInfoType> {
  const basic = await usersStore.get(userId);

  if (!full) {
    return basic;
  }
}
