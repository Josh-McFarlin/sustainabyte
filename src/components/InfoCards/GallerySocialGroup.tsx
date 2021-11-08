import * as React from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import { useQueries } from "react-query";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import { fetchUser } from "../../actions/user";
import { SocialGroupType } from "../../types/SocialGroup";
import { UserType } from "../../types/User";
import { AuthNavigationProp } from "../../navigation/authed/types";

type PropTypes = {
  group: SocialGroupType;
};

const GallerySocialGroup: React.FC<PropTypes> = ({ group }) => {
  const navigation = useNavigation<AuthNavigationProp>();
  const userQueries = useQueries(
    group.members.slice(0, 3).map((user) => ({
      queryKey: ["user", user],
      queryFn: fetchUser,
      enabled: user != null,
    }))
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.hContainer, styles.bottomMargin]}>
          <Image
            style={styles.image}
            source={{
              uri: group.iconUrl,
            }}
          />
          <Text style={styles.name}>{group.name}</Text>
        </View>
        <View
          style={[styles.hContainer, styles.spaceBetween, styles.bottomMargin]}
        >
          <View style={styles.hContainer}>
            {userQueries.map(({ data }) => (
              <TouchableWithoutFeedback
                key={data?._id}
                onPress={() =>
                  navigation.navigate("UserProfile", {
                    id: data?._id,
                    isOwnProfile: false,
                    isFollowing: false,
                  })
                }
              >
                <Image
                  style={styles.userAvatar}
                  source={{
                    uri: data?.avatarUrl,
                  }}
                />
              </TouchableWithoutFeedback>
            ))}
          </View>
          <Text style={styles.secondary}>{group.members.length} people</Text>
          <FontAwesome5 name="chevron-right" size={20} color="#4b9193" />
        </View>
        <View style={[styles.hContainer, styles.spaceBetween]}>
          {userQueries.length > 0 ? (
            <Text style={styles.secondary}>
              Followed by {(userQueries[0]?.data as UserType)?.username}
              {userQueries.length > 1
                ? ` + ${group.members.length - 1} more`
                : ""}
            </Text>
          ) : (
            <View />
          )}
          <TouchableWithoutFeedback>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Follow</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    borderRadius: 12,
    margin: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  content: {
    padding: 16,
  },
  hContainer: {
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: "cover",
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: "#888",
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor: "#fff",
    borderWidth: 3,
    marginRight: -15,
    backgroundColor: "#888",
  },
  secondaryContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  spaceBetween: {
    justifyContent: "space-between",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4b9193",
  },
  secondary: {
    fontSize: 12,
    marginRight: 4,
    color: "#747474",
    fontWeight: "700",
  },
  button: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    backgroundColor: "#4b9193",
    borderRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  bottomMargin: {
    marginBottom: 8,
  },
});

export default GallerySocialGroup;
