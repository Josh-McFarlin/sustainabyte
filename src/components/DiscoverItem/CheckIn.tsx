import * as React from "react";
import {
  View,
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
import type { BasicUserType } from "../../types/User";
import { BasicRestaurantType } from "../../types/Restaurant";
import { CheckInType } from "../../types/CheckIn";
import { AuthNavigationProp } from "../../navigation/authed/types";
import { toggleSave } from "../../actions/save";
import { useAuth } from "../../utils/auth";
import { toggleLike } from "../../actions/like";

type PropTypes = {
  user?: BasicUserType;
  restaurant?: BasicRestaurantType;
  data: CheckInType;
  saved: boolean;
};

const iconColor = "#3C8D90";

const DiscoverCheckIn: React.FC<PropTypes> = ({
  user,
  restaurant,
  data,
  saved,
}) => {
  const { withUsers, createdAt } = data;
  const { user: authedUser } = useAuth();
  const isOwnProfile = user != null && authedUser._id === user._id;
  const navigation = useNavigation<AuthNavigationProp>();

  const [liked, setLiked] = React.useState<boolean>(
    data?.likedBy?.includes(authedUser._id) || false
  );

  const likeImage = React.useCallback(async () => {
    const newData = await toggleLike("CheckIn", data._id);

    setLiked(newData?.likedBy?.includes(authedUser._id) || false);
  }, [data, authedUser]);

  const saveImage = React.useCallback(async () => {
    try {
      await toggleSave("CheckIn", data._id);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save!");
    }
  }, [data]);

  return (
    <View style={styles.container}>
      <View style={styles.bottomBar}>
        <View style={styles.restInfo}>
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
          <View style={styles.nameTags}>
            <View>
              <Text>
                <Text style={styles.restName}>{user?.username || ""}</Text>{" "}
                <Text style={styles.otherText}>checked into</Text>{" "}
                <Text style={styles.restName}>{restaurant?.name || ""}</Text>
              </Text>
              {withUsers.length > 0 && (
                <View style={styles.hRow}>
                  <Text style={styles.minorText}>
                    with{" "}
                    {withUsers.map((withUserId, index) => (
                      <React.Fragment key={withUserId}>
                        <Text style={styles.nameText}>{withUserId}</Text>
                        {index !== withUserId.length - 1 && (
                          <Text style={styles.minorText}>,</Text>
                        )}
                      </React.Fragment>
                    ))}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
        <View style={styles.buttonRow}>
          <FontAwesome5
            style={styles.button}
            name="crown"
            size={24}
            color="#FFC601"
          />
          <TouchableOpacity style={styles.button} onPress={likeImage}>
            {liked ? (
              <FontAwesome name="heart" size={24} color="#FA5B6B" />
            ) : (
              <FontAwesome5 name="heart" size={24} color="#FA5B6B" />
            )}
          </TouchableOpacity>
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
  },
});

export default view(DiscoverCheckIn);
