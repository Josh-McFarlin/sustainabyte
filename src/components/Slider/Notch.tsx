import * as React from "react";
import { View, StyleSheet } from "react-native";

const Notch: React.FC = (props) => <View style={styles.root} {...props} />;

const styles = StyleSheet.create({
  root: {
    width: 8,
    height: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#3C8D90",
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 8,
  },
});

export default React.memo(Notch);
