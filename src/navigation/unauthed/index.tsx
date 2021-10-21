import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StarterScreen from "./screens/Starter";
import type { UnauthedNavParamList } from "./types";

const Stack = createNativeStackNavigator<UnauthedNavParamList>();

const UnauthedNavigator: React.FC = () => (
  <Stack.Navigator initialRouteName="Starter">
    <Stack.Screen
      name="Starter"
      component={StarterScreen}
      options={{
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

export default UnauthedNavigator;
