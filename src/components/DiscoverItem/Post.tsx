import * as React from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import dayjs from "dayjs";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import PhotoGallery from "../PhotoGallery";
import type { UserType } from "../../types/User";
import { RestaurantType } from "../../types/Restaurant";
import { PostType } from "../../types/Post";

type PropTypes = {
  user?: UserType;
  restaurant?: RestaurantType;
  data: PostType;
};

const crownColor = (selected: boolean) => (selected ? "#FFC601" : "#b4b4b4");
const heartColor = (selected: boolean) => (selected ? "#FA5B6B" : "#b4b4b4");
const iconColor = "#3C8D90";

const DiscoverPost: React.FC<PropTypes> = ({ user, restaurant, data }) => {
  const { tags, photoUrls, body, createdAt } = data;
  const follows = false;
  const saved = false;

  const handlePlus = React.useCallback(() => {
    console.log("Pressed plus");
  }, []);

  const crownImage = React.useCallback(() => {
    console.log("Crowned image");
  }, []);

  const likeImage = React.useCallback(() => {
    console.log("Liked image");
  }, []);

  const saveImage = React.useCallback(() => {
    console.log("Saved image");
  }, []);

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
          {restaurant != null && (
            <>
              <Text style={styles.otherText}>checked into</Text>{" "}
              <Text style={styles.restName}>{restaurant?.name || ""}</Text>
            </>
          )}
        </Text>
        <TouchableOpacity style={styles.flex} onPress={handlePlus}>
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
            <ScrollView horizontal>
              {tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text>#{tag}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={crownImage}>
            <FontAwesome5 name="crown" size={24} color={crownColor(true)} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={likeImage}>
            <FontAwesome name="heart" size={24} color={heartColor(true)} />
          </TouchableOpacity>
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "#77bd67",
    color: "#000",
    marginHorizontal: 4,
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
});

export default DiscoverPost;
