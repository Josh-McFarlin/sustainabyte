import * as React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  View,
  ListRenderItem,
} from "react-native";
import type { ReviewType } from "../../types/Review";

const numColumns = 3;

export const renderItem: ListRenderItem<ReviewType> = ({ item }) => (
  <View key={item._id} style={styles.post}>
    <TouchableOpacity
      style={styles.button}
      onPress={() => {
        console.log(item._id);
      }}
    >
      <Image
        style={styles.image}
        source={{
          uri: item.photoUrls[0],
        }}
      />
    </TouchableOpacity>
  </View>
);

const screenWidth = Dimensions.get("window").width;
const padding = 4;
const tileSize = screenWidth / numColumns;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  post: {
    width: tileSize,
    height: tileSize,
    padding,
  },
  button: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    backgroundColor: "#ccc",
    borderRadius: 8,
  },
});

export const listProps = {
  style: styles.container,
  numColumns,
};
