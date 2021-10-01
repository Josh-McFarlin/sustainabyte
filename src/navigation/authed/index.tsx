import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/Home";
import type { AuthedNavParamList } from "./types";
import { useAuth } from "../../utils/auth";

const Tab = createBottomTabNavigator<AuthedNavParamList>();

const AuthedNavigator: React.FC = () => {
  const { user } = useAuth();

  if (user == null) {
    return null;
  }

  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen name="Home" component={HomeScreen} />
    </Tab.Navigator>
  );
};

export default AuthedNavigator;
