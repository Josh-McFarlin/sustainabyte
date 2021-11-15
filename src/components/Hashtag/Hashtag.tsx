import * as React from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { hashtagsToColors } from "../../utils/hashtags";

interface PropTypes {
  hashtag: string;
  selected?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Hashtag: React.FC<PropTypes> = ({
  hashtag,
  selected = false,
  style,
  textStyle,
}) => (
  <View
    style={[
      styles.selectableItem,
      selected
        ? {
            ...styles.itemSelected,
            backgroundColor: hashtagsToColors[hashtag],
            borderColor: hashtagsToColors[hashtag],
          }
        : styles.itemUnselected,
      style,
    ]}
  >
    <Text style={[styles.text, textStyle]}>#{hashtag}</Text>
  </View>
);

const styles = StyleSheet.create({
  selectableItem: {
    borderColor: "#A7A4A4",
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginVertical: 8,
  },
  itemSelected: {
    backgroundColor: "#3C8D90",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  itemUnselected: {
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 14,
    color: "#000",
  },
});

export default React.memo(Hashtag);
