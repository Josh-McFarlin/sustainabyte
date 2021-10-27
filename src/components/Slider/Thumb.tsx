import * as React from "react";
import { View, StyleSheet } from "react-native";
import Label from "./Label";
import Notch from "./Notch";

type PropTypes = {
  displayLabel?: boolean;
  label?: string | number;
};

const Thumb: React.FC<PropTypes> = ({ displayLabel, label }) => (
  <View style={styles.root}>
    {displayLabel && (
      <View style={styles.labelContainer}>
        <Label text={label} style={styles.label} />
        <Notch />
      </View>
    )}
  </View>
);

const THUMB_RADIUS = 12;
const BORDER_RADIUS = 4;

const styles = StyleSheet.create({
  root: {
    width: THUMB_RADIUS * 2,
    height: THUMB_RADIUS * 2,
    borderRadius: THUMB_RADIUS,
    borderWidth: BORDER_RADIUS,
    borderColor: "#3C8D90",
    backgroundColor: "#ffffff",
    position: "relative",
  },
  labelContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: THUMB_RADIUS + BORDER_RADIUS * 2,
    alignItems: "center",
  },
  label: {
    flex: 0,
    alignSelf: "center",
    alignItems: "center",
    width: 50,
  },
});

Thumb.defaultProps = {
  displayLabel: false,
  label: 20,
};

export default React.memo(Thumb);
