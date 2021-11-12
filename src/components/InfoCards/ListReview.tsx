import * as React from "react";
import { StyleSheet, Image, View, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { view } from "@risingstack/react-easy-state";
import { ReviewType } from "../../types/Review";
import usersStore from "../../utils/userData";

type PropTypes = {
  review: ReviewType;
};

const ListReview: React.FC<PropTypes> = ({ review }) => {
  const user = review?.user != null ? usersStore.get(review.user) : null;

  return (
    <View style={styles.container}>
      <Image
        style={styles.userAvatar}
        source={{
          uri: user?.avatarUrl,
        }}
      />
      <Text style={styles.body}>{review.body}</Text>
      <FontAwesome5
        style={styles.icon}
        name="chevron-right"
        size={14}
        color="black"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ccc",
    marginRight: 12,
  },
  body: {
    flex: 1,
    fontSize: 14,
  },
  icon: {
    marginLeft: 16,
  },
});

export default view(ListReview);
