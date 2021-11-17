import * as React from "react";
import { StyleSheet, View, ListRenderItem } from "react-native";
import { ListCheckIn } from "../InfoCards";
import { CheckInType } from "../../types/CheckIn";

export const RenderItem: ListRenderItem<CheckInType> = ({ item }) => (
  <View style={styles.item}>
    <View style={styles.line} />
    <ListCheckIn checkIn={item} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
  },
  list: {
    position: "relative",
    flex: 1,
    backgroundColor: "#ffffff",
  },
  item: {
    flex: 1,
    paddingVertical: 16,
    position: "relative",
  },
  line: {
    position: "absolute",
    left: 39,
    width: 3,
    height: 100,
    backgroundColor: "#3C8D90",
    zIndex: -1,
  },
});

export const listProps = {
  style: styles.list,
};
