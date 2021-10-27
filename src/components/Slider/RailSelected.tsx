import * as React from "react";
import { StyleSheet, View } from "react-native";

const RailSelected: React.FC = () => <View style={styles.root} />;

const styles = StyleSheet.create({
  root: {
    height: 4,
    backgroundColor: "#3C8D90",
    borderRadius: 2,
  },
});

export default React.memo(RailSelected);
