import * as React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  Dimensions,
  Pressable,
  Platform,
} from "react-native";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackdrop,
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

const useBackdrop = Platform.select({
  web: false,
  default: true,
});

const SettingsSheet = React.forwardRef<BottomSheet>((_, sheetRef) => {
  const navigation = useNavigation<AuthNavigationProp>();
  const snapPoints = React.useMemo(() => ["50%"], []);

  const renderBackdrop = React.useCallback(
    (props) =>
      useBackdrop ? (
        <BottomSheetBackdrop
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
          enableTouchThrough
          {...props}
        />
      ) : null,
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
      animateOnMount={false}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
        {settings.map((item) => (
          <TouchableHighlight
            key={item.name}
            onPress={() => navigation.navigate(item.route)}
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
  backdrop: {
    position: "absolute",
    top: 0,
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
    backgroundColor: "#000",
    opacity: 0.3,
    zIndex: 10000000,
  },
});

export default SettingsSheet;
