import * as React from "react";
import {
  StyleSheet,
  Image,
  View,
  ListRenderItem,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { PostType } from "../../types/Post";
import { AuthNavigationProp } from "../../navigation/authed/types";

const numColumns = 3;

export const RenderItem: ListRenderItem<PostType> = ({ item }) => {
  const window = useWindowDimensions();
  const navigation = useNavigation<AuthNavigationProp>();

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Post", {
          id: item._id,
          post: item,
        })
      }
    >
      <View
        style={[
          styles.post,
          {
            width: window.width / numColumns,
            height: window.width / numColumns,
          },
        ]}
      >
        <Image
          style={styles.image}
          source={{
            uri: item.photoUrls[0],
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  post: {
    padding: 4,
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
