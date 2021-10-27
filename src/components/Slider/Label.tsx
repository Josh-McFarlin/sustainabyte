import * as React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";

type PropTypes = {
  text: string | number;
  style?: ViewStyle;
};

const Label: React.FC<PropTypes> = ({ text, style, ...rest }) => (
  <View style={[styles.root, style]} {...rest}>
    <Text style={styles.text}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    padding: 8,
    backgroundColor: "#3C8D90",
    borderRadius: 4,
  },
  text: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});

Label.defaultProps = {
  style: undefined,
};

export default React.memo(Label);
