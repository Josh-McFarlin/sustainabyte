import * as React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useAuth } from "../../../utils/auth";
import type { AuthedNavParamList } from "../types";

type PropTypes = BottomTabScreenProps<AuthedNavParamList, "Profile">;

const ProfileScreen: React.FC<PropTypes> = () => {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text>Profile Screen</Text>
      <Text>Hello {user.email}</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ProfileScreen;
