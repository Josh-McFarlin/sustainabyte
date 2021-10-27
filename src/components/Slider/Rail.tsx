import * as React from "react";
import { View, StyleSheet } from "react-native";

const Rail: React.FC = () => <View style={styles.root} />;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#C4C4C4",
  },
});

export default React.memo(Rail);
