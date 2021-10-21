import * as React from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import { useQueries } from "react-query";
import { fetchUser } from "../../actions/user";
import { SocialGroup } from "../../types/SocialGroup";
import { User } from "../../types/User";

type PropTypes = {
  group: SocialGroup;
};

const GallerySocialGroup: React.FC<PropTypes> = ({ group }) => {
  const userQueries = useQueries(
    group.members.slice(0, 3).map((user) => ({
      queryKey: ["user", user],
      queryFn: fetchUser,
    }))
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.hContainer, styles.bottomMargin]}>
          <Image
            style={styles.image}
            source={{
              uri: group.icon,
            }}
          />
          <Text style={styles.name}>{group.name}</Text>
        </View>
        <View
          style={[styles.hContainer, styles.spaceBetween, styles.bottomMargin]}
        >
          <View style={styles.hContainer}>
            {userQueries.map(({ data }) => (
              <Image
                style={styles.userAvatar}
                source={{
                  uri: (data as User)?.avatarUrl,
                }}
              />
            ))}
          </View>
          <Text style={styles.secondary}>{group.members.length} people</Text>
        </View>
        <View style={styles.hContainer}>
          <Text style={styles.secondary}>
            Followed by {(userQueries[0]?.data as User)?.username} +{" "}
            {group.members.length - 1} more
          </Text>
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
    resizeMode: "contain",
    marginRight: 12,
    borderRadius: 12,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: "#fff",
    borderWidth: 3,
    marginRight: -15,
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
