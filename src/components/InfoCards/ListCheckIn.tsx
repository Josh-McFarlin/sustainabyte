import * as React from "react";
import { StyleSheet, Image, View, Text } from "react-native";
import dayjs from "dayjs";
import type { CheckInType } from "../../types/CheckIn";
import restaurantsStore from "../../utils/restaurantData";
import usersStore from "../../utils/userData";

type PropTypes = {
  checkIn: CheckInType;
};

const ListCheckIn: React.FC<PropTypes> = ({ checkIn }) => {
  const restaurant =
    checkIn?.restaurant != null
      ? restaurantsStore.get(checkIn.restaurant)
      : null;
  const users =
    checkIn?.withUsers != null
      ? checkIn.withUsers.map((userId) => usersStore.get(userId))
      : [];

  return (
    <View style={styles.container}>
      <Image
        style={styles.restAvatar}
        source={{
          uri: restaurant?.avatarUrl,
        }}
      />
      <View>
        <Text style={styles.restaurant}>{restaurant?.name || ""}</Text>
        <Text style={styles.when}>
          {dayjs(checkIn?.createdAt).format("MMM D, h:mmA")}
        </Text>
        {users.length > 0 && (
          <View style={styles.with}>
            <Text>with</Text>
            {users.map((user) => (
              <View key={user?._id} style={styles.withUser}>
                <Image
                  style={styles.withAvatar}
                  source={{ uri: user?.avatarUrl }}
                />
                <Text style={styles.withName}>{user?.name}</Text>
              </View>
            ))}
          </View>
        )}
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
    paddingLeft: 12,
  },
  restAvatar: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#ccc",
    marginRight: 12,
    zIndex: 20,
  },
  restaurant: {
    fontSize: 18,
    fontWeight: "bold",
  },
  when: {
    //
  },
  with: {
    display: "flex",
    flexDirection: "row",
  },
  withUser: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  withAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 4,
  },
  withName: {
    fontSize: 14,
    color: "#3C8D90",
  },
});

export default ListCheckIn;
