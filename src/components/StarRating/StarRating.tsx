import * as React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { View, StyleSheet, ViewStyle } from "react-native";

interface PropTypes {
  rating: number;
  size?: number;
  primaryColor?: string;
  secondaryColor?: string;
  onPress?: (rating: number) => void;
  style?: ViewStyle;
}

const StarRating: React.FC<PropTypes> = ({
  rating,
  size = 16,
  primaryColor = "#3C8D90",
  secondaryColor = "#8B8B8B",
  onPress,
  style,
}) => (
  <View style={[styles.container, style]}>
    {Array.from(Array(5)).map((_, i) => (
      <FontAwesome
        key={i}
        name="star"
        size={size}
        color={rating >= i + 1 ? primaryColor : secondaryColor}
        style={styles.star}
        onPress={onPress ? () => onPress(i + 1) : undefined}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  star: {
    marginHorizontal: 1,
  },
});

export default StarRating;
