import * as React from "react";
import MapView from "react-native-maps";
import { StyleSheet, View, Dimensions } from "react-native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { AuthedNavParamList } from "../types";

type PropTypes = BottomTabScreenProps<AuthedNavParamList, "RestaurantMap">;

const RestaurantMapScreen: React.FC<PropTypes> = () => {
  return (
    <View style={styles.container}>
      <MapView style={styles.map} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default RestaurantMapScreen;
