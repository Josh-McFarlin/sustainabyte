import * as React from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { signUp } from "../../../utils/firebase/actions/auth";
import type { UnauthedNavParamList } from "../types";

type PropTypes = NativeStackScreenProps<UnauthedNavParamList, "SignUp">;

const SignUpScreen: React.FC<PropTypes> = ({ navigation }) => {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [confPass, setConf] = React.useState<string>("");

  const handleSignUp = React.useCallback(async () => {
    try {
      if (email.length < 5 || password.length < 3) {
        throw new Error("Please provide all fields!");
      } else if (password !== confPass) {
        throw new Error("Passwords do not match!");
      }

      await signUp(email, password);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  }, [email, password, confPass]);

  return (
    <View style={{ flex: 1 }}>
      <Text>Sign Up Screen</Text>
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} />
      <Text>Password</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry />
      <Text>Confirm Password</Text>
      <TextInput value={confPass} onChangeText={setConf} secureTextEntry />
      <Button title="Sign Up" onPress={handleSignUp} />
      <Button title="Login" onPress={() => navigation.navigate("Login")} />
    </View>
  );
};

export default SignUpScreen;
