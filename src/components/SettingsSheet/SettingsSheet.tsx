import * as React from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableHighlight,
} from "react-native";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { FontAwesome } from "@expo/vector-icons";

const settings = [
  {
    name: "Account Settings",
    icon: "gear" as const,
    action: () => {
      console.log("settings");
    },
  },
  {
    name: "Your Preferences",
    icon: "sliders" as const,
    action: () => {
      console.log("prefs");
    },
  },
  {
    name: "Your Cart",
    icon: "shopping-cart" as const,
    action: () => {
      console.log("cart");
    },
  },
  {
    name: "Order History",
    icon: "history" as const,
    action: () => {
      console.log("history");
    },
  },
  {
    name: "Payments",
    icon: "credit-card" as const,
    action: () => {
      console.log("payments");
    },
  },
];

const SettingsSheet = React.forwardRef<BottomSheet>((_, sheetRef) => {
  const snapPoints = React.useMemo(() => ["50%"], []);

  const renderBackdrop = React.useCallback(
    (props) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
        {...props}
      />
    ),
    []
  );

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      enableContentPanningGesture
      style={styles.sheet}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
        {settings.map((item) => (
          <TouchableHighlight
            key={item.name}
            onPress={item.action}
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
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  sheet: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    elevation: 15,
  },
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

export default SettingsSheet;
