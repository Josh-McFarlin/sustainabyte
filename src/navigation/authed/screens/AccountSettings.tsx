import * as React from "react";
import {
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  SafeAreaView,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { StackNavParamList } from "../types";
import { useAuth } from "../../../utils/auth";

type PropTypes = NativeStackScreenProps<StackNavParamList, "AccountSettings">;

const AccountSettingsScreen: React.FC<PropTypes> = () => {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.section}>
          <Text>Currently signed in as:</Text>
          <Text>{user.name}</Text>
        </View>
        <View style={styles.section}>
          <TouchableWithoutFeedback onPress={logout}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Logout</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderColor: "#3C8D90",
    borderWidth: 2,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    color: "#3C8D90",
  },
});

export default AccountSettingsScreen;
