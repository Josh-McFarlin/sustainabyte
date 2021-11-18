import * as React from "react";
import { StyleSheet, View, Text, TouchableHighlight } from "react-native";
import {
  BottomSheetScrollView,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  AuthNavigationProp,
  StackNavParamList,
} from "../../navigation/authed/types";

const settings: {
  name: string;
  icon: keyof typeof FontAwesome["glyphMap"];
  route: keyof StackNavParamList;
}[] = [
  {
    name: "Account Settings",
    icon: "gear" as const,
    route: "AccountSettings",
  },
  {
    name: "Your Preferences",
    icon: "sliders" as const,
    route: "Preferences",
  },
  {
    name: "Your Cart",
    icon: "shopping-cart" as const,
    route: "Preferences",
  },
  {
    name: "Order History",
    icon: "history" as const,
    route: "Preferences",
  },
  {
    name: "Payments",
    icon: "credit-card" as const,
    route: "Preferences",
  },
];

const SettingsSheet: React.FC = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const { dismissAll } = useBottomSheetModal();

  return (
    <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
      {settings.map((item) => (
        <TouchableHighlight
          key={item.name}
          onPress={() => {
            dismissAll();
            navigation.navigate(item.route);
          }}
          activeOpacity={0.9}
          underlayColor="#ececec"
        >
          <View style={styles.item}>
            <FontAwesome
              style={styles.icon}
              name={item.icon}
              size={28}
              color="#3C8D90"
            />
            <Text style={styles.text}>{item.name}</Text>
          </View>
        </TouchableHighlight>
      ))}
    </BottomSheetScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "#ffffff",
  },
  item: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderColor: "#d4d4d4",
  },
  icon: {
    marginRight: 16,
  },
  text: {
    fontSize: 20,
  },
});

export default React.memo(SettingsSheet);
