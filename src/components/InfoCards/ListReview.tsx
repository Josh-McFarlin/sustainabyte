import * as React from "react";
import { StyleSheet, Image, View, Text } from "react-native";
import dayjs from "dayjs";
import { useQuery } from "react-query";
import { fetchUser } from "../../actions/user";
import { UserType } from "../../types/User";
import { ReviewType } from "../../types/Review";

type PropTypes = {
  review: ReviewType;
};

const ListCheckIn: React.FC<PropTypes> = ({ review }) => {
  const { data: user } = useQuery<UserType, Error>(
    ["user", review.user],
    fetchUser,
    {
      enabled: review?.user != null,
    }
  );

  if (review == null || user == null) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.userAvatar}
        source={{
          uri: user.avatarUrl,
        }}
      />
      <View style={styles.flex}>
        <View style={styles.hRow}>
          <Text style={styles.details}>{user.username}</Text>
          <Text style={[styles.details, styles.textEnd, styles.flex]}>
            {dayjs(review.createdAt).format("MMM D, h:mmA")}
          </Text>
        </View>

        <Text style={styles.body}>{review.body}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ccc",
    marginRight: 12,
    zIndex: 20,
  },
  hRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  details: {
    fontSize: 16,
  },
  body: {
    fontSize: 14,
  },
  textEnd: {
    textAlign: "right",
  },
  flex: {
    flex: 1,
  },
});

export default ListCheckIn;
