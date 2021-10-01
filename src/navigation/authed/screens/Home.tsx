import * as React from "react";
import { View, Text, Button } from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useAuth } from "../../../utils/auth";
import { logout } from "../../../utils/firebase/actions/auth";
import {
  getDocument,
  setDocument,
  updateDocument,
} from "../../../utils/firebase/actions/firestore";
import type { AuthedNavParamList } from "../types";

type PropTypes = BottomTabScreenProps<AuthedNavParamList, "Home">;

const updateLoginCount = async (): Promise<number> => {
  try {
    const doc = await getDocument("pageCounts", "home");

    await updateDocument("pageCounts", "home", {
      count: doc.count + 1,
    });

    return doc.count + 1;
  } catch (error) {
    await setDocument("pageCounts", "home", {
      count: 1,
    });

    return 1;
  }
};

const HomeScreen: React.FC<PropTypes> = () => {
  const { user } = useAuth();
  const [loginCount, setLoginCount] = React.useState<number | null>(null);

  React.useEffect(() => {
    updateLoginCount().then(setLoginCount);
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
      <Text>Hello {user.email}</Text>
      <Text>
        Total Logins: {loginCount != null ? loginCount : "...Loading..."}
      </Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

export default HomeScreen;
