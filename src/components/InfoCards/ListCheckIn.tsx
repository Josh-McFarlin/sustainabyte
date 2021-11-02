import * as React from "react";
import { StyleSheet, Image, View, Text } from "react-native";
import dayjs from "dayjs";
import { QueryObserverResult, useQueries, useQuery } from "react-query";
import type { CheckIn } from "../../types/CheckIn";
import { fetchUser } from "../../actions/user";
import { Restaurant } from "../../types/Restaurant";
import { fetchRestaurant } from "../../actions/restaurant";
import { User } from "../../types/User";

type PropTypes = {
  checkIn: CheckIn;
};

const ListCheckIn: React.FC<PropTypes> = ({ checkIn }) => {
  const { data: restaurant } = useQuery<Restaurant, Error>(
    ["restaurant", checkIn?.restaurant],
    fetchRestaurant,
    {
      enabled: checkIn?.restaurant != null,
    }
  );
  const userQueries: QueryObserverResult<User, Error>[] = useQueries(
    checkIn?.withUsers?.map((user) => ({
      queryKey: ["user", user],
      queryFn: fetchUser,
      enabled: user != null,
    })) || []
  ) as any;

  if (checkIn == null || restaurant == null) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.restAvatar}
        source={{
          uri: restaurant.avatarUrl,
        }}
      />
      <View>
        <Text style={styles.restaurant}>{restaurant.name}</Text>
        <Text style={styles.when}>
          {dayjs(checkIn.createdAt).format("MMM D, h:mmA")}
        </Text>
        {userQueries.length > 0 && (
          <View style={styles.with}>
            <Text>with</Text>
            {userQueries
              .filter(({ data }) => data != null)
              .map(({ data: user }) => (
                <View key={user.id} style={styles.withUser}>
                  <Image
                    style={styles.withAvatar}
                    source={{ uri: user.avatarUrl }}
                  />
                  <Text style={styles.withName}>{user.name}</Text>
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
