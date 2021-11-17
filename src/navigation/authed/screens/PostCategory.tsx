import * as React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { view } from "@risingstack/react-easy-state";
import dayjs from "dayjs";
import PostGallery from "../../../components/PostGallery";
import { PostType } from "../../../types/Post";
import { StackNavParamList } from "../types";

type PropTypes = NativeStackScreenProps<StackNavParamList, "PostCategory">;

const PostCategoryScreen: React.FC<PropTypes> = ({ route, navigation }) => {
  const { type, posts, lastUpdated } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <FlatList<PostType>
          style={styles.container}
          data={posts}
          keyExtractor={(i) => i._id}
          renderItem={(i) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Post", {
                  id: i.item._id,
                  post: i.item,
                })
              }
            >
              <PostGallery.RenderItem {...i} />
            </TouchableOpacity>
          )}
          ListHeaderComponent={() => (
            <View style={[styles.hRow, styles.header]}>
              <View style={styles.icon}>
                <Text style={styles.iconText}>{type.substring(0, 2)}</Text>
              </View>
              <View>
                <Text style={styles.headerTitle}>{type}</Text>
                <View style={styles.hRow}>
                  <Text style={styles.headerSubtitle}>
                    {posts.length} images
                  </Text>
                  <View style={styles.circle} />
                  <Text style={styles.headerSubtitle}>
                    Last updated {dayjs(lastUpdated).format("MM/DD/YYYY")}
                  </Text>
                </View>
              </View>
            </View>
          )}
          {...PostGallery.listProps}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 8,
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
});

export default view(PostCategoryScreen);
