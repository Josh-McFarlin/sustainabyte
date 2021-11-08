import * as React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import type { UserType } from "../../../types/User";

type PropTypes = {
  user: UserType;
};

const TopBar: React.FC<PropTypes> = ({ user }) => {
  const follows = false;
  const handlePlus = React.useCallback(() => {
    console.log("Pressed plus");
  }, []);

  return (
    <View style={styles.topContainer}>
      <Image
        style={styles.topAvatar}
        source={{
          uri: user?.avatarUrl,
        }}
      />
      <Text style={styles.topUsername}>{user?.username || ""}</Text>
      <TouchableOpacity onPress={handlePlus}>
        <Text style={styles.topFollowText}>
          {follows ? "Follow" : "Following"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#aaaaaa",
  },
  topAvatar: {
    width: 36,
    height: 36,
    borderRadius: 50,
    marginRight: 8,
    backgroundColor: "#ccc",
  },
  topUsername: {
    fontSize: 12,
    fontWeight: "bold",
    flex: 1,
  },
  topFollowText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#3C8D90",
  },
});

export default TopBar;
