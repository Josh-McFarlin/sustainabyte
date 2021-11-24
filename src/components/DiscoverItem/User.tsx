import * as React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { view } from "@risingstack/react-easy-state";
import type { UserType } from "../../types/User";
import { AuthNavigationProp } from "../../navigation/authed/types";
import usersStore from "../../utils/userData";

type PropTypes = {
  data: UserType;
  follows: boolean;
};

const DiscoverUser: React.FC<PropTypes> = ({ data, follows }) => {
  const { _id, avatarUrl, username, followers } = data;
  const navigation = useNavigation<AuthNavigationProp>();

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
});

export default view(DiscoverUser);
