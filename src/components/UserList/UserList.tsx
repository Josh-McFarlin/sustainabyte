import * as React from "react";
import {
  StyleSheet,
  View,
  ListRenderItem,
  Pressable,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { AuthNavigationProp } from "../../navigation/authed/types";
import usersStore from "../../utils/userData";
import { UserType } from "../../types/User";
import { useAuth } from "../../utils/auth";

export const RenderItem: ListRenderItem<UserType> = ({ item }) => {
  const { _id, avatarUrl, username, followers } = item;

  const navigation = useNavigation<AuthNavigationProp>();
  const { user: authedUser } = useAuth();

  const follows =
    authedUser._id === _id || usersStore?.following?.has(_id) || false;

  return (
    <Pressable
      onPress={() => {
        usersStore.addRecent(_id);
        navigation.navigate("UserProfile", {
          id: _id,
        });
      }}
    >
      <View style={styles.container}>
        <Image
          style={styles.avatar}
          source={{
            uri: avatarUrl,
          }}
        />
        <View>
          <Text style={styles.title}>{username || ""}</Text>
          <Text style={styles.subtitle}>
            {follows ? "Following" : `Followed by ${followers || 0}`}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export const RenderRecentItem: ListRenderItem<UserType> = ({ item }) => {
  const { _id, avatarUrl, username, followers } = item;

  const navigation = useNavigation<AuthNavigationProp>();
  const { user: authedUser } = useAuth();

  const follows =
    authedUser._id === _id || usersStore?.following?.has(_id) || false;

  return (
    <Pressable
      onPress={() => {
        usersStore.addRecent(_id);
        navigation.navigate("UserProfile", {
          id: _id,
        });
      }}
    >
      <View style={styles.container}>
        <Image
          style={styles.avatar}
          source={{
            uri: avatarUrl,
          }}
        />
        <View style={styles.flex}>
          <Text style={styles.title}>{username || ""}</Text>
          <Text style={styles.subtitle}>
            {follows ? "Following" : `Followed by ${followers || 0}`}
          </Text>
        </View>
        <TouchableOpacity onPress={() => usersStore.removeRecent(_id)}>
          <FontAwesome name="times-circle" size={18} color="#A0A0A0" />
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#aaaaaa",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 12,
    backgroundColor: "#ccc",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: "#727272",
  },
  flex: {
    flex: 1,
  },
});

export const listProps = {};
