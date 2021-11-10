import * as React from "react";
import {
  StyleSheet,
  Image,
  Dimensions,
  View,
  ListRenderItem,
} from "react-native";
import type { PostType } from "../../types/Post";

const numColumns = 3;

export const renderItem: ListRenderItem<PostType> = ({ item }) => (
  <View key={item._id} style={styles.post}>
    <Image
      style={styles.image}
      source={{
        uri: item.photoUrls[0],
      }}
    />
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
