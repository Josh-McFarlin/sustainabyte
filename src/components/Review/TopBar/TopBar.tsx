import * as React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import type { User } from "../../../types/User";

type PropTypes = {
  user: User;
};

const TopBar: React.FC<PropTypes> = ({ user }) => {
  const follows = false;
  const handlePlus = React.useCallback(() => {
    console.log("Pressed plus");
  }, []);

  return (
    <View style={styles.container}>
      <Image
        style={styles.avatar}
        source={{
          uri: user.avatarUrl,
        }}
      />
      <Text style={styles.username}>{user.username}</Text>
      <TouchableOpacity onPress={handlePlus}>
        <Text style={styles.followText}>
          {follows ? "Follow" : "Following"}
        </Text>
      </TouchableOpacity>
    </View>
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
    width: 36,
    height: 36,
    borderRadius: 50,
    marginRight: 8,
  },
  username: {
    fontSize: 12,
    fontWeight: "bold",
    flex: 1,
  },
  followText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#3C8D90",
  },
});

export default TopBar;
