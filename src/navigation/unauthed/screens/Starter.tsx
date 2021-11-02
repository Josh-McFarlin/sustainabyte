import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { UnauthedNavParamList } from "../types";
import { useAuth } from "../../../utils/auth";

type PropTypes = NativeStackScreenProps<UnauthedNavParamList, "Starter">;

const StarterScreen: React.FC<PropTypes> = () => {
  const { login } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Let&apos;s sign you in.</Text>
      <Image
        style={styles.camera}
        source={require("../../../../assets/icons/camera-white-no-bg.png")}
      />
      <Text style={styles.subtitle}>Eat, Engage & Enjoy</Text>
      <TouchableOpacity onPress={login}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Sign In</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#23626A",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
  },
  subtitle: {
    color: "#fff",
    fontSize: 24,
    marginTop: 24,
    marginBottom: 48,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 48,
    backgroundColor: "#3EAC7E",
    width: Dimensions.get("screen").width * 0.8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default StarterScreen;
