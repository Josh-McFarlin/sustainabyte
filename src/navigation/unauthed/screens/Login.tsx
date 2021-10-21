import * as React from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { UnauthedNavParamList } from "../types";
import { useAuth } from "../../../utils/auth";

type PropTypes = NativeStackScreenProps<UnauthedNavParamList, "Login">;

const LoginScreen: React.FC<PropTypes> = ({ navigation }) => {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const { login } = useAuth();

  // React.useEffect(() => {
  //   login();
  // }, [login]);

  const handleLogin = React.useCallback(async () => {
    try {
      if (email.length < 5 || password.length < 3) {
        throw new Error("Please provide all fields!");
      }

      // await login(email, password);
      login();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  }, [login, email, password]);

  return (
    <View style={{ flex: 1 }}>
      <Text>Login Screen</Text>
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} />
      <Text>Password</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Login" onPress={login} />
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
