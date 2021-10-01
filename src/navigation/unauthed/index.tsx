import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/Login";
import ResetPasswordScreen from "./screens/ResetPassword";
import SignUpScreen from "./screens/SignUp";
import type { UnauthedNavParamList } from "./types";

const Stack = createNativeStackNavigator<UnauthedNavParamList>();

const UnauthedNavigator: React.FC = () => (
  <Stack.Navigator initialRouteName="Login">
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
  </Stack.Navigator>
);

export default UnauthedNavigator;
