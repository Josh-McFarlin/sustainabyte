import * as React from "react";
import {
  StyleSheet,
  SectionList,
  View,
  Text,
  SectionListData,
} from "react-native";
import dayjs from "dayjs";
import { ListCheckIn } from "../InfoCards";
import type { CheckIn } from "../../types/CheckIn";

type PropTypes = {
  checkIns: CheckIn[];
};

const CheckInHistory: React.FC<PropTypes> = ({ checkIns }) => {
  const sections = React.useMemo<SectionListData<CheckIn>[]>(() => {
    const result = new Map<
      string,
      {
        title: string;
        data: CheckIn[];
      }
    >();

    checkIns.forEach((checkIn) => {
      const date = dayjs(checkIn.createdAt).format("ddd, MMM D");

      if (result.has(date)) {
        result.get(date).data.push(checkIn);
      } else {
        result.set(date, {
          title: date,
          data: [checkIn],
        });
      }
    });

    return [...result.values()];
  }, [checkIns]);

  return (
    <View style={styles.container}>
      <SectionList
        stickySectionHeadersEnabled={false}
        style={styles.list}
        sections={sections}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.line} />
            <ListCheckIn checkIn={item} />
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.header}>
            <View style={styles.line} />
            <Text>{title}</Text>
            <View style={styles.circle} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    marginVertical: 4,
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
    paddingVertical: 16,
    position: "relative",
  },
  line: {
    position: "absolute",
    left: 38,
    top: 0,
    width: 3,
    height: "100%",
    backgroundColor: "#3C8D90",
    zIndex: -1,
  },
  circle: {
    position: "absolute",
    left: 32,
    top: "50%",
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#3C8D90",
    zIndex: 3,
    marginTop: -8,
  },
});

export default CheckInHistory;
