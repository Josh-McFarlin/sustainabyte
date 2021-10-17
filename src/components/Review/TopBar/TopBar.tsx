import * as React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import type { User } from "../../../types/User";

type PropTypes = {
  user: User;
};

const TopBar: React.FC<PropTypes> = ({ user }) => {
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
        <FontAwesome5 name="plus" size={16} color="black" />
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
    padding: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#aaaaaa",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 50,
    marginRight: 8,
  },
  username: {
    fontSize: 12,
    fontWeight: "bold",
    flex: 1,
  },
});

export default TopBar;
