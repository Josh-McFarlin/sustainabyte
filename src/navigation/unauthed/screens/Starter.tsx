import * as React from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { UnauthedNavParamList } from "../types";
import { useAuth } from "../../../utils/auth";

type PropTypes = NativeStackScreenProps<UnauthedNavParamList, "Starter">;

const StarterScreen: React.FC<PropTypes> = () => {
  const { login } = useAuth();

  return (
    <View style={styles.container}>
      <Text>Welcome to Sustainabyte!</Text>
      <Text>Please login!</Text>
      <Button title="Login" onPress={login} />
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

export default StarterScreen;
