import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Pressable,
} from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useQuery } from "react-query";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import dayjs from "dayjs";
import { view } from "@risingstack/react-easy-state";
import { StackNavParamList } from "../types";
import { deletePost, fetchPost } from "../../../actions/post";
import type { PostType } from "../../../types/Post";
import PhotoGallery from "../../../components/PhotoGallery";
import usersStore from "../../../utils/userData";
import restaurantsStore from "../../../utils/restaurantData";
import Hashtag from "../../../components/Hashtag/Hashtag";
import { useAuth } from "../../../utils/auth";
import { toggleLike } from "../../../actions/like";
import { toggleSave } from "../../../actions/save";

const iconColor = "#3C8D90";

type PropTypes = NativeStackScreenProps<StackNavParamList, "Post">;

const PostScreen: React.FC<PropTypes> = ({ route, navigation }) => {
  const { id, post: initialPost } = route.params;
  const { user: authedUser } = useAuth();

  const { data: post } = useQuery<PostType, Error>(["post", id], fetchPost, {
    enabled: id != null && initialPost == null,
    initialData: initialPost,
  });
  const restaurant =
    post != null && post?.restaurant != null
      ? restaurantsStore.get(post.restaurant)
      : null;
  const user =
    post != null && post?.user != null ? usersStore.get(post.user) : null;
  const isOwnProfile = user != null && authedUser._id === user._id;
  const [liked, setLiked] = React.useState<boolean>(
    post?.likedBy?.includes(authedUser._id) || false
  );

  React.useEffect(() => {
    if (restaurant != null) {
      navigation.setOptions({
        headerTitle: restaurant.name,
      });
    }
  }, [restaurant, navigation]);

  const likeImage = React.useCallback(async () => {
    const newData = await toggleLike("Post", post._id);

    setLiked(newData?.likedBy?.includes(authedUser._id) || false);
  }, [post, authedUser]);

  const saveImage = React.useCallback(async () => {
    try {
      if (isOwnProfile) return;

      await toggleSave("Post", post._id);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save!");
    }
  }, [post, isOwnProfile]);

  const handleDelete = React.useCallback(async () => {
    try {
      await deletePost(post._id);

      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to delete!");
    }
  }, []);

  if (post == null || (restaurant == null && user == null)) {
    return null;
  }

  const { tags, photoUrls, body, createdAt } = post;
  const saved = isOwnProfile || usersStore.saved?.has(post._id) || false;

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Pressable
          onPress={() =>
            navigation.navigate("UserProfile", {
              id: user._id,
            })
          }
        >
          <Image
            style={styles.topAvatar}
            source={{
              uri: user?.avatarUrl,
            }}
          />
        </Pressable>
        <Text>
          <Text style={styles.restName}>{user?.username || ""}</Text>{" "}
          {restaurant != null && (
            <>
              <Text style={styles.otherText}>checked into</Text>{" "}
              <Text style={styles.restName}>{restaurant?.name || ""}</Text>
            </>
          )}
        </Text>
      </View>
      {photoUrls.length > 0 && <PhotoGallery photos={photoUrls} />}
      <View style={styles.bottomBar}>
        <View style={styles.restInfo}>
          {restaurant != null && (
            <View style={styles.avatarWrapper}>
              <Pressable
                onPress={() =>
                  navigation.navigate("RestaurantProfile", {
                    id: restaurant._id,
                  })
                }
              >
                <Image
                  style={styles.avatar}
                  source={{
                    uri: restaurant?.avatarUrl,
                  }}
                />
              </Pressable>
            </View>
          )}
          <View style={styles.nameTags}>
            {restaurant != null && (
              <Text style={styles.restName}>{restaurant?.name || ""}</Text>
            )}
            <ScrollView horizontal style={styles.hashtagContainer}>
              {tags.map((tag) => (
                <Hashtag key={tag} style={styles.tag} hashtag={tag} selected />
              ))}
            </ScrollView>
          </View>
        </View>
        <View style={styles.buttonRow}>
          <View style={styles.buttonCol}>
            <FontAwesome5
              style={styles.button}
              name="crown"
              size={24}
              color="#FFC601"
            />
            <Text style={styles.buttonColText}>+20</Text>
          </View>
          <View style={styles.buttonCol}>
            <TouchableOpacity style={styles.button} onPress={likeImage}>
              {liked ? (
                <FontAwesome name="heart" size={24} color="#FA5B6B" />
              ) : (
                <FontAwesome5 name="heart" size={24} color="#FA5B6B" />
              )}
            </TouchableOpacity>
            <Text style={styles.buttonColText}>
              {post.likedBy?.length || 0}
            </Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={saveImage}>
            <FontAwesome
              name={saved ? "bookmark" : "bookmark-o"}
              size={24}
              color={iconColor}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.bodyRow}>
          <Text>{body}</Text>
        </View>
        <View style={[styles.hRow, styles.spaceBetween]}>
          {isOwnProfile && (
            <TouchableOpacity onPress={handleDelete}>
              <Text style={styles.deleteText}>Delete Post</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.date}>{dayjs(createdAt).format("MMM D")}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 8,
  },
  bottomBar: {
    padding: 8,
    backgroundColor: "#ffffff",
  },
  restInfo: {
    display: "flex",
    flexDirection: "row",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 12,
    margin: 8,
    backgroundColor: "#ccc",
  },
  avatarWrapper: {
    backgroundColor: "#fff",
    zIndex: 5,
  },
  nameTags: {
    flex: 1,
    paddingBottom: 8,
  },
  restName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  otherText: {
    fontSize: 15,
    marginBottom: 8,
  },
  minorText: {
    fontSize: 16,
    marginBottom: 8,
    color: "#8D8D8D",
  },
  nameText: {
    fontSize: 16,
    marginBottom: 8,
    color: "#3C8D90",
    fontWeight: "bold",
  },
  tag: {
    marginRight: 8,
  },
  buttonRow: {
    display: "flex",
    flexDirection: "row",
    marginVertical: 12,
  },
  button: {
    marginHorizontal: 8,
  },
  filler: {
    flex: 1,
  },
  scoreRow: {
    fontWeight: "bold",
    fontSize: 12,
    marginVertical: 4,
  },
  date: {
    flex: 1,
    textAlign: "right",
    fontSize: 12,
    color: "#909090",
  },
  spacer: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 4,
  },
  bodyRow: {
    fontSize: 14,
    marginVertical: 4,
  },
  hRow: {
    display: "flex",
    flexDirection: "row",
  },
  topContainer: {
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#aaaaaa",
    flexWrap: "wrap",
  },
  topAvatar: {
    width: 36,
    height: 36,
    borderRadius: 50,
    marginRight: 8,
    backgroundColor: "#ccc",
  },
  topUsername: {
    fontSize: 12,
    fontWeight: "bold",
    flex: 1,
  },
  topFollowText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#3C8D90",
    textAlign: "right",
  },
  flex: {
    flex: 1,
    minWidth: 100,
  },
  hashtagContainer: {
    overflow: "visible",
    zIndex: -1,
  },
  buttonCol: {
    alignItems: "center",
  },
  buttonColText: {
    fontSize: 14,
    color: "#000",
    marginTop: 4,
    fontWeight: "500",
  },
  spaceBetween: {
    justifyContent: "space-between",
  },
  deleteText: {
    fontSize: 12,
    color: "#FA5B6B",
  },
});

export default view(PostScreen);
