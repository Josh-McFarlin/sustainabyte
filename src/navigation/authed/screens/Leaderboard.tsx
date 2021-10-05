import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useAuth } from "../../../utils/auth";
import type { AuthedNavParamList } from "../types";

type PropTypes = BottomTabScreenProps<AuthedNavParamList, "Leaderboard">;

const LeaderboardScreen: React.FC<PropTypes> = () => {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Text>Leaderboard Screen</Text>
      <Text>Hello {user.email}</Text>
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

export default LeaderboardScreen;
