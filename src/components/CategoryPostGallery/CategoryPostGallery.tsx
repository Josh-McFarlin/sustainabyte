import * as React from "react";
import {
  StyleSheet,
  Image,
  View,
  ListRenderItem,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/native";
import type { CategoryPostsType } from "../../types/Post";
import { AuthNavigationProp } from "../../navigation/authed/types";

export const RenderItem: ListRenderItem<CategoryPostsType> = ({ item }) => {
  const navigation = useNavigation<AuthNavigationProp>();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("PostCategory", {
            type: item.type,
            posts: item.posts,
            lastUpdated: item.lastUpdated.valueOf(),
          })
        }
      >
        <View style={[styles.hRow, styles.header]}>
          <View style={styles.icon}>
            <Text style={styles.iconText}>{item.type.substring(0, 2)}</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>{item.type}</Text>
            <View style={styles.hRow}>
              <Text style={styles.headerSubtitle}>
                {item.posts.length} images
              </Text>
              <View style={styles.circle} />
              <Text style={styles.headerSubtitle}>
                Last updated {dayjs(item.lastUpdated).format("MM/DD/YYYY")}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <FlatList
        horizontal
        data={item.posts}
        style={styles.flatlist}
        contentContainerStyle={styles.flatlist}
        keyExtractor={(i) => i._id}
        renderItem={({ item: post }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Post", {
                id: post._id,
                post,
              })
            }
          >
            <View style={styles.post}>
              <Image
                style={styles.image}
                source={{
                  uri: post.photoUrls[0],
                }}
              />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 8,
    paddingVertical: 12,
    overflow: "visible",
  },
  hRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  header: {
    marginBottom: 8,
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#3C8D90",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  iconText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    textTransform: "capitalize",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 2,
    textTransform: "capitalize",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#7C7C7C",
  },
  circle: {
    width: 4,
    height: 4,
    borderRadius: 16,
    backgroundColor: "#7C7C7C",
    marginHorizontal: 4,
  },
  post: {
    width: 220,
    height: 150,
    marginRight: 6,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    backgroundColor: "#ccc",
    borderRadius: 8,
  },
  flatlist: {
    overflow: "visible",
  },
});

export const listProps = {
  // style: styles.container,
};
