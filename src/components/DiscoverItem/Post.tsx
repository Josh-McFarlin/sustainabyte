import * as React from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import dayjs from "dayjs";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { view } from "@risingstack/react-easy-state";
import PhotoGallery from "../PhotoGallery";
import type { BasicUserType } from "../../types/User";
import { BasicRestaurantType } from "../../types/Restaurant";
import { PostType } from "../../types/Post";
import StarRating from "../StarRating";
import Hashtag from "../Hashtag/Hashtag";
import { AuthNavigationProp } from "../../navigation/authed/types";
import { useAuth } from "../../utils/auth";
import { toggleSave } from "../../actions/save";
import { toggleLike } from "../../actions/like";

type PropTypes = {
  data: PostType;
  user: BasicUserType;
  restaurant: BasicRestaurantType;
  saved: boolean;
};

const iconColor = "#3C8D90";

const DiscoverPost: React.FC<PropTypes> = ({
  data,
  user,
  restaurant,
  saved,
}) => {
  const { tags, photoUrls, body, createdAt } = data;
  const { user: authedUser } = useAuth();
  const isOwnProfile = user != null && authedUser._id === user._id;
  const navigation = useNavigation<AuthNavigationProp>();
  const [liked, setLiked] = React.useState<boolean>(
    data?.likedBy?.includes(authedUser._id) || false
  );

  const likeImage = React.useCallback(async () => {
    const newData = await toggleLike("Post", data._id);

    setLiked(newData?.likedBy?.includes(authedUser._id) || false);
  }, [data, authedUser]);

  const saveImage = React.useCallback(async () => {
    try {
      if (isOwnProfile) return;

      await toggleSave("Post", data._id);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save!");
    }
  }, [data, isOwnProfile]);

  const rating =
    restaurant != null ? restaurant.ratings.sum / restaurant.ratings.count : 0;

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
      <View style={styles.curvedBar} />
      <View style={styles.bottomBar}>
        <View style={styles.restInfo}>
          {restaurant != null && (
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
          )}
          <View style={styles.nameTags}>
            {restaurant != null && (
              <View style={[styles.hRow, styles.center]}>
                <Text style={styles.restName}>{restaurant?.name || ""}</Text>
                <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
                <StarRating rating={rating} size={14} />
              </View>
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
              {data.likedBy?.length || 0}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={isOwnProfile ? null : saveImage}
          >
            <FontAwesome
              name={isOwnProfile || saved ? "bookmark" : "bookmark-o"}
              size={24}
              color={iconColor}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.spacer} />
        <View style={styles.bodyRow}>
          <Text>{body}</Text>
        </View>
        <Text style={styles.date}>{dayjs(createdAt).format("MMM D")}</Text>
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
    paddingTop: 0,
    backgroundColor: "#ffffff",
  },
  restInfo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 12,
    marginRight: 8,
    backgroundColor: "#ccc",
  },
  nameTags: {
    flex: 1,
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
  center: {
    alignItems: "center",
  },
  ratingText: {
    flex: 1,
    fontSize: 14,
    color: "#3C8D90",
    textAlign: "right",
    marginRight: 4,
  },
  curvedBar: {
    height: 16,
    backgroundColor: "#fff",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginTop: -15,
  },
  hashtagContainer: {
    overflow: "visible",
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
});

export default view(DiscoverPost);
