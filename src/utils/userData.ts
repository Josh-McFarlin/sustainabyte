import { autoEffect, store } from "@risingstack/react-easy-state";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BasicUserType, UserType } from "../types/User";
import { fetchUser } from "../actions/user";

const usersKey = "USERS";
const recentKey = "RECENT-USERS";
const userKey = (userId: UserType["_id"]) => `${usersKey}-${userId}`;

const usersStore = store({
  users: new Map<UserType["_id"], BasicUserType | UserType>(),
  retrieving: new Set<UserType["_id"]>(),
  retrieved: new Set<UserType["_id"]>(),
  followers: new Set<string>(),
  following: new Set<string>(),
  saved: new Set<string>(),
  recentUsers: new Array<UserType["_id"]>(),
  get(userId: UserType["_id"]): BasicUserType | null {
    if (
      !usersStore.retrieving.has(userId) &&
      !usersStore.retrieved.has(userId) &&
      !usersStore.users.has(userId)
    ) {
      fetchUser({
        queryKey: ["", userId],
        meta: {},
      });
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

    return {
      _id: "",
      username: "",
      name: "",
      avatarUrl: "",
    };
  },
  getFull(userId: UserType["_id"]): UserType | BasicUserType | null {
    if (
      !usersStore.retrieving.has(userId) &&
      !usersStore.retrieved.has(userId)
    ) {
      fetchUser({
        queryKey: ["", userId],
        meta: {},
      });
    }

    if (usersStore.users.has(userId)) {
      return usersStore.users.get(userId);
    }

    return {
      _id: "",
      auth0Id: "",
      name: "",
      email: "",
      username: "",
      avatarUrl: "",
      score: 0,
      locations: [],
      groups: [],
      followers: 0,
      following: 0,
      saved: 0,
      createdAt: new Date(),
    };
  },
  addRecent: (userId: UserType["_id"]) => {
    usersStore.recentUsers.unshift(userId);
    usersStore.recentUsers.splice(10);
    AsyncStorage.setItem(recentKey, JSON.stringify(usersStore.recentUsers));
  },
  removeRecent: (userId: UserType["_id"]) => {
    usersStore.recentUsers = usersStore.recentUsers.filter(
      (user) => user !== userId
    );
    usersStore.recentUsers = usersStore.recentUsers.slice(0, 10);
    AsyncStorage.setItem(recentKey, JSON.stringify(usersStore.recentUsers));
  },
});

autoEffect(async () => {
  try {
    const stored = await AsyncStorage.getItem(usersKey);

    if (stored != null) {
      const userIds: BasicUserType["_id"][] = JSON.parse(stored);
      const newUsers = new Map();

      await Promise.all(
        userIds.map(async (userId) => {
          try {
            const userStr = await AsyncStorage.getItem(userKey(userId));

            if (userStr != null) {
              const user: BasicUserType = JSON.parse(userStr);

              newUsers.set(user._id, user);
            }
          } catch (error) {
            console.error(`Failed loading user: ${userId}`);
          }
        })
      );

      usersStore.users = newUsers;

      const storedRecent = await AsyncStorage.getItem(recentKey);
      if (storedRecent != null) {
        usersStore.recentUsers = JSON.parse(storedRecent);
      }
    }
  } catch (error) {
    console.log("Failed to setup usersStore!", error?.message || error);
  }
});

export const storeUser = async (user: UserType): Promise<void> => {
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
};

export default usersStore;
