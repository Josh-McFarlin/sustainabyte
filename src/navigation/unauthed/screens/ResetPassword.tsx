import * as React from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  resetPassword,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from "../../../utils/firebase/actions/auth";
import type { UnauthedNavParamList } from "../types";

type PropTypes = NativeStackScreenProps<UnauthedNavParamList, "ResetPassword">;

enum ResetStage {
  UNSENT,
  WAIT_CODE,
  WAIT_PASSWORD,
  DONE,
}

const ResetPasswordScreen: React.FC<PropTypes> = ({ navigation, route }) => {
  const [email, setEmail] = React.useState<string>(route.params?.email || "");
  const [code, setCode] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [confPass, setConf] = React.useState<string>("");
  const [stage, setStage] = React.useState<ResetStage>(ResetStage.UNSENT);

  const handleReset = React.useCallback(async () => {
    try {
      if (
        email.length < 5 ||
        (stage >= ResetStage.WAIT_PASSWORD &&
          (password.length < 3 || confPass.length < 3))
      ) {
        throw new Error("Please provide all fields!");
      }

      if (stage === ResetStage.UNSENT) {
        await resetPassword(email);
        setStage(ResetStage.WAIT_CODE);

        Alert.alert("Sent", "Please check your email for a reset code!");
      } else if (stage === ResetStage.WAIT_CODE) {
        await verifyPasswordResetCode(code);
        setStage(ResetStage.WAIT_PASSWORD);
      } else {
        if (password !== confPass) {
          throw new Error("Passwords do not match!");
        }

        await confirmPasswordReset(code, password);
        setStage(ResetStage.DONE);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  }, [email, password, confPass, code, stage]);

  const handleResend = React.useCallback(async () => {
    try {
      if (email.length < 5) {
        throw new Error("Please provide all fields!");
      }

      await resetPassword(email);
      setStage(ResetStage.WAIT_CODE);

      Alert.alert("Sent", "Please check your email for a reset code!");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  }, [email]);

  return (
    <View style={{ flex: 1 }}>
      <Text>Reset Password Screen</Text>
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} />
      {stage >= ResetStage.WAIT_CODE && (
        <>
          <Text>Reset Code</Text>
          <TextInput value={code} onChangeText={setCode} secureTextEntry />
        </>
      )}
      {stage === ResetStage.WAIT_PASSWORD && (
        <>
          <Text>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Text>Confirm Password</Text>
          <TextInput value={confPass} onChangeText={setConf} secureTextEntry />
        </>
      )}

      <Button
        title={stage !== ResetStage.DONE ? "Continue" : "Done"}
        onPress={handleReset}
      />
      <Button title="Cancel" onPress={() => navigation.goBack()} />
      {stage >= ResetStage.WAIT_CODE && (
        <Button title="Resend Code" onPress={handleResend} />
      )}
    </View>
  );
};

export default ResetPasswordScreen;
