import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useQuery } from "react-query";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import type { AuthedNavParamList } from "../types";
import { WaveLeft, WaveRight } from "../../../components/Waves";
import { fetchUsers } from "../../../actions/user";
import { User } from "../../../types/User";

type PropTypes = BottomTabScreenProps<AuthedNavParamList, "Leaderboard">;

enum TimeSpan {
  TODAY,
  WEEK,
  MONTH,
}

const LeaderboardScreen: React.FC<PropTypes> = () => {
  const [timeSpan, setTimeSpan] = React.useState<TimeSpan>(TimeSpan.WEEK);
  const { data: users } = useQuery<User[], Error>(["users"], fetchUsers, {
    initialData: [],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.waveContainer}>
          <WaveRight style={[styles.wave, styles.waveRight]} />
          <WaveLeft style={[styles.wave, styles.waveLeft]} />
          <View style={styles.rankContainer}>
            <Text style={[styles.title, styles.marginBottom]}>Leaderboard</Text>
            <View
              style={[styles.hRow, styles.spaceAround, styles.marginBottom]}
            >
              <TouchableOpacity
                style={styles.button}
                onPress={() => setTimeSpan(TimeSpan.TODAY)}
              >
                <View
                  style={
                    timeSpan === TimeSpan.TODAY
                      ? styles.selectedSpan
                      : styles.spanContainer
                  }
                >
                  <Text style={styles.spanText}>Today</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setTimeSpan(TimeSpan.WEEK)}>
                <View
                  style={
                    timeSpan === TimeSpan.WEEK
                      ? styles.selectedSpan
                      : styles.spanContainer
                  }
                >
                  <Text style={styles.spanText}>Week</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setTimeSpan(TimeSpan.MONTH)}>
                <View
                  style={
                    timeSpan === TimeSpan.MONTH
                      ? styles.selectedSpan
                      : styles.spanContainer
                  }
                >
                  <Text style={styles.spanText}>Month</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={[styles.hRow, styles.center, styles.marginBottom]}>
              <FontAwesome5 name="crown" size={32} color="#FFC601" />
            </View>
            <View style={[styles.hRow, styles.center, styles.alignEnd]}>
              <View style={[styles.vRow, styles.center]}>
                <View style={styles.avatarShadow}>
                  <Image
                    style={[styles.topAvatar, styles.otherAvatars]}
                    source={{
                      uri: users?.[1]?.avatarUrl,
                    }}
                  />
                </View>
                <View style={styles.placeWrapper}>
                  <LinearGradient
                    colors={["#27F9FF", "#3C8D90"]}
                    style={styles.placeCircle}
                  >
                    <Text style={styles.placeCircleText}>2</Text>
                  </LinearGradient>
                </View>
              </View>
              <View style={[styles.vRow, styles.center, styles.taZindex]}>
                <View style={styles.avatarShadow}>
                  <Image
                    style={[styles.topAvatar, styles.firstAvatar]}
                    source={{
                      uri: users?.[0]?.avatarUrl,
                    }}
                  />
                </View>
                <View style={styles.placeWrapper}>
                  <LinearGradient
                    colors={["#27F9FF", "#3C8D90"]}
                    style={styles.placeCircle}
                  >
                    <Text style={styles.placeCircleText}>1</Text>
                  </LinearGradient>
                </View>
              </View>
              <View style={[styles.vRow, styles.center]}>
                <View style={styles.avatarShadow}>
                  <Image
                    style={[styles.topAvatar, styles.otherAvatars]}
                    source={{
                      uri: users?.[2]?.avatarUrl,
                    }}
                  />
                </View>
                <View style={styles.placeWrapper}>
                  <LinearGradient
                    colors={["#27F9FF", "#3C8D90"]}
                    style={styles.placeCircle}
                  >
                    <Text style={styles.placeCircleText}>3</Text>
                  </LinearGradient>
                </View>
              </View>
            </View>
          </View>
        </View>
        <FlatList
          style={styles.list}
          data={users.slice(3)}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={styles.listItem}>
              <Text style={styles.itemText}>{index + 4}</Text>
              <Image style={styles.avatar} source={{ uri: item.avatarUrl }} />
              <Text style={styles.itemText}>@{item.username}</Text>
              <FontAwesome5
                style={styles.crown}
                name="crown"
                size={18}
                color="#FFC601"
              />
              <Text style={styles.itemText}>{item.score}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
  },
  waveContainer: {
    width: Dimensions.get("screen").width,
    height: 320,
  },
  rankContainer: {
    zIndex: 12,
  },
  wave: {
    position: "absolute",
    top: 0,
  },
  waveLeft: {
    left: -20,
    zIndex: 2,
  },
  waveRight: {
    right: 0,
    zIndex: 1,
  },
  list: {
    flex: 1,
    padding: 16,
    marginTop: 8,
  },
  listItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#9EC1C3",
    padding: 24,
    borderRadius: 64,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 32,
    marginHorizontal: 12,
    backgroundColor: "#ccc",
  },
  itemText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  crown: {
    marginLeft: "auto",
    marginRight: 4,
  },
  vRow: {
    display: "flex",
    flexDirection: "column",
  },
  hRow: {
    display: "flex",
    flexDirection: "row",
  },
  spaceBetween: {
    justifyContent: "space-between",
  },
  spaceAround: {
    justifyContent: "space-around",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  alignEnd: {
    alignItems: "flex-end",
  },
  topAvatar: {
    borderWidth: 4,
    borderColor: "#3C8D90",
    backgroundColor: "#ccc",
  },
  taZindex: {
    zIndex: 30,
  },
  avatarShadow: {
    shadowColor: "#00FFFF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,
    elevation: 13,
    borderRadius: 100,
  },
  firstAvatar: {
    width: 120,
    height: 120,
    borderRadius: 75,
    zIndex: 20,
  },
  otherAvatars: {
    width: 90,
    height: 90,
    borderRadius: 50,
    marginHorizontal: -15,
    zIndex: 18,
  },
  placeWrapper: {
    borderRadius: 50,
    overflow: "hidden",
    marginTop: -20,
  },
  placeCircle: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  placeCircleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  selectedSpan: {
    backgroundColor: "#00726D",
    paddingVertical: 4,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  spanContainer: {
    paddingVertical: 4,
    paddingHorizontal: 20,
  },
  spanText: {
    fontSize: 16,
    color: "#fff",
  },
  title: {
    fontSize: 32,
    color: "#fff",
    textAlign: "center",
    marginVertical: 16,
  },
  marginBottom: {
    marginBottom: 16,
  },
  button: {
    zIndex: 30,
  },
});

export default LeaderboardScreen;
