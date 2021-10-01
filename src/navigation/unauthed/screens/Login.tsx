import * as React from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { login } from "../../../utils/firebase/actions/auth";
import type { UnauthedNavParamList } from "../types";

type PropTypes = NativeStackScreenProps<UnauthedNavParamList, "Login">;

const LoginScreen: React.FC<PropTypes> = ({ navigation }) => {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  const handleLogin = React.useCallback(async () => {
    try {
      if (email.length < 5 || password.length < 3) {
        throw new Error("Please provide all fields!");
      }

      await login(email, password);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  }, [email, password]);

  return (
    <View style={{ flex: 1 }}>
      <Text>Login Screen</Text>
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} />
      <Text>Password</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Login" onPress={handleLogin} />
      <Button
        title="Reset Password"
        onPress={() =>
          navigation.navigate("ResetPassword", {
            email,
          })
        }
      />
      <Button title="Sign Up" onPress={() => navigation.navigate("SignUp")} />
    </View>
  );
};

export default LoginScreen;
