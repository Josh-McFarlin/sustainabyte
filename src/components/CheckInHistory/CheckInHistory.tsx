import * as React from "react";
import {
  StyleSheet,
  View,
  Text,
  ListRenderItem,
  SectionListRenderItem,
} from "react-native";
import { ListCheckIn } from "../InfoCards";
import { CheckIn } from "../../types/CheckIn";

// const sections = React.useMemo<SectionListData<CheckIn>[]>(() => {
//   const result = new Map<
//     string,
//     {
//       title: string;
//       data: CheckIn[];
//     }
//   >();
//
//   checkIns.forEach((checkIn) => {
//     const date = dayjs(checkIn.createdAt).format("ddd, MMM D");
//
//     if (result.has(date)) {
//       result.get(date).data.push(checkIn);
//     } else {
//       result.set(date, {
//         title: date,
//         data: [checkIn],
//       });
//     }
//   });
//
//   return [...result.values()];
// }, [checkIns]);

export const renderItem: ListRenderItem<CheckIn> = ({ item }) => (
  <View style={styles.item}>
    <View style={styles.line} />
    <ListCheckIn checkIn={item} />
  </View>
);

export const renderSectionHeader: SectionListRenderItem<CheckIn> = ({
  section: { title },
}) => (
  <View style={styles.header}>
    <View style={styles.line} />
    <Text>{title}</Text>
    <View style={styles.circle} />
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
  header: {
    width: 180,
    position: "relative",
    backgroundColor: "#9EC1C3",
    paddingVertical: 12,
    paddingRight: 12,
    borderBottomRightRadius: 32,
    borderTopRightRadius: 32,
    alignItems: "flex-end",
    zIndex: 2,
  },
  headerText: {
    fontSize: 16,
    color: "#000",
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
  circle: {
    position: "absolute",
    left: 32,
    top: 0,
    bottom: 0,
    width: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: "#3C8D90",
    zIndex: 3,
    marginTop: 12,
  },
});

export const listProps = {
  style: styles.list,
};
