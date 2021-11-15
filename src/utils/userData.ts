import { store, autoEffect } from "@risingstack/react-easy-state";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BasicUserType, UserType } from "../types/User";
import { QueueSet } from "./DataStructures";
import { fetchUser } from "../actions/user";

const usersKey = "USERS";
const userKey = (userId: UserType["_id"]) => `${usersKey}-${userId}`;

const usersStore = store({
  users: new Map<UserType["_id"], BasicUserType | UserType>(),
  retrieved: new Set<UserType["_id"]>(),
  retrieveQueue: new QueueSet<UserType["_id"]>(),
  get(userId: UserType["_id"]): BasicUserType | null {
    if (
      !usersStore.retrieved.has(userId) &&
      !usersStore.retrieveQueue.has(userId)
    ) {
      usersStore.retrieveQueue.add(userId);
    }

    if (usersStore.users.has(userId)) {
      const user = usersStore.users.get(userId);

      return {
        _id: user._id,
        username: user.username,
        name: user.name,
        avatarUrl: user.avatarUrl,
      };
    }

    return null;
  },
  getFull(userId: UserType["_id"]): UserType | BasicUserType | null {
    if (
      !usersStore.retrieved.has(userId) &&
      !usersStore.retrieveQueue.has(userId)
    ) {
      usersStore.retrieveQueue.add(userId);
    }

    if (usersStore.users.has(userId)) {
      return usersStore.users.get(userId);
    }

    return null;
  },
});

autoEffect(async () => {
  const stored = await AsyncStorage.getItem(usersKey);

  if (stored != null) {
    const userIds: BasicUserType["_id"][] = JSON.parse(stored);

    await Promise.all(
      userIds.map(async (userId) => {
        try {
          const userStr = await AsyncStorage.getItem(userKey(userId));

          if (userStr != null) {
            const user: BasicUserType = JSON.parse(userStr);

            usersStore.users.set(user._id, user);
          }
        } catch (error) {
          console.error(`Failed loading user: ${userId}`);
        }
      })
    );
  }
});

autoEffect(async () => {
  const queue = usersStore.retrieveQueue;

  if (queue.size > 0) {
    const userId = queue.peek();

    const user = await fetchUser({
      queryKey: ["", userId],
      meta: {},
    });

    usersStore.retrieved.add(user._id);
    usersStore.users.set(user._id, user);
    await AsyncStorage.setItem(
      userKey(user._id),
      JSON.stringify({
        _id: user._id,
        username: user.username,
        name: user.name,
        avatarUrl: user.avatarUrl,
      })
    );
    await AsyncStorage.setItem(
      usersKey,
      JSON.stringify([...usersStore.users.keys()])
    );

    queue.remove();
  }
});

export default usersStore;
