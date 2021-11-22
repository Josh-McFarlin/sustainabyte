import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useQuery } from "react-query";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import dayjs from "dayjs";
import { view } from "@risingstack/react-easy-state";
import { StackNavParamList } from "../types";
import { fetchReview } from "../../../actions/review";
import type { ReviewType } from "../../../types/Review";
import PhotoGallery from "../../../components/PhotoGallery";
import restaurantsStore from "../../../utils/restaurantData";
import usersStore from "../../../utils/userData";
import Hashtag from "../../../components/Hashtag/Hashtag";
import { useAuth } from "../../../utils/auth";
import { toggleFollow } from "../../../actions/follow";
import { toggleLike } from "../../../actions/like";
import { toggleSave } from "../../../actions/save";

const iconColor = "#3C8D90";

type PropTypes = NativeStackScreenProps<StackNavParamList, "Review">;

const ReviewScreen: React.FC<PropTypes> = ({ route }) => {
  const { id, review: initialReview } = route.params;
  const { user: authedUser } = useAuth();

  const { data: review } = useQuery<ReviewType, Error>(
    ["review", id],
    fetchReview,
    {
      enabled: id != null && initialReview == null,
      initialData: initialReview,
    }
  );
  const restaurant =
    review != null && review?.restaurant != null
      ? restaurantsStore.get(review.restaurant)
      : null;
  const user =
    review != null && review?.user != null ? usersStore.get(review.user) : null;
  const isOwnProfile = user != null && authedUser._id === user._id;
  const [liked, setLiked] = React.useState<boolean>(
    review?.likedBy?.includes(authedUser._id) || false
  );

  const handleFollow = React.useCallback(async () => {
    await toggleFollow(
      user == null ? "Restaurant" : "User",
      user == null ? restaurant._id : user._id
    );
  }, [user, restaurant]);

  const likeImage = React.useCallback(async () => {
    const newData = await toggleLike("Review", review._id);

    setLiked(newData?.likedBy?.includes(authedUser._id) || false);
  }, [review, authedUser]);

  const saveImage = React.useCallback(async () => {
    try {
      if (isOwnProfile) return;

      await toggleSave("CheckIn", review._id);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save!");
    }
  }, [review, isOwnProfile]);

  if (review == null || (restaurant == null && user == null)) {
    return null;
  }

  const { tags, photoUrls, body, createdAt } = review;
  const follows =
    isOwnProfile ||
    usersStore?.following?.has(user?._id || restaurant?._id) ||
    false;
  const saved = isOwnProfile || usersStore.saved?.has(review._id) || false;

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Image
          style={styles.topAvatar}
          source={{
            uri: user?.avatarUrl,
          }}
        />
        <Text>
          <Text style={styles.restName}>{user?.username || ""}</Text>{" "}
          <Text style={styles.otherText}>checked into</Text>{" "}
          <Text style={styles.restName}>{restaurant?.name || ""}</Text>
        </Text>
        <TouchableOpacity style={styles.flex} onPress={handleFollow}>
          <Text style={styles.topFollowText}>
            {follows ? "Follow" : "Following"}
          </Text>
        </TouchableOpacity>
      </View>
      {photoUrls.length > 0 && <PhotoGallery photos={photoUrls} />}
      <View style={styles.bottomBar}>
        <View style={styles.restInfo}>
          <Image
            style={styles.avatar}
            source={{
              uri: restaurant?.avatarUrl,
            }}
          />
          <View style={styles.nameTags}>
            <Text style={styles.restName}>{restaurant?.name || ""}</Text>
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
            <Text style={styles.buttonColText}>+15</Text>
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
              {review.likedBy?.length || 0}
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

export default view(ReviewScreen);
