import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useQuery } from "react-query";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import type { TabNavParamList } from "../types";
import { fetchUsers } from "../../../actions/user";
import { User } from "../../../types/User";

type PropTypes = BottomTabScreenProps<TabNavParamList, "Leaderboard">;

enum TabTypes {
  LEADERBOARD,
  CHALLENGES,
  MONTH,
}

const LeaderboardScreen: React.FC<PropTypes> = () => {
  const [curTab, setCurTab] = React.useState<TabTypes>(TabTypes.LEADERBOARD);
  const { data: users } = useQuery<User[], Error>(["users"], fetchUsers, {
    initialData: [],
  });

  const tabs = React.useMemo(
    () => ({
      [TabTypes.LEADERBOARD]: {
        type: TabTypes.LEADERBOARD,
        icon: ({ ...props }) => <Ionicons name="grid" {...props} />,
        title: "Leaderboard",
        data: users,
        listProps: {},
        PrimaryActions: () => (
          <>
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
          </>
        ),
        Header: () => (
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>This Week&apos;s Leaderboard</Text>
          </View>
        ),
        Footer: () => null,
        renderItem: ({ item, index }) => (
          <View style={styles.listItem}>
            <Text style={styles.itemText}>{index + 1}</Text>
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
        ),
      },
      [TabTypes.CHALLENGES]: {
        type: TabTypes.CHALLENGES,
        icon: ({ ...props }) => <FontAwesome5 name="map-pin" {...props} />,
        title: "Challenges",
        data: users,
        listProps: {},
        PrimaryActions: () => (
          <>
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
          </>
        ),
        Header: () => (
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Ongoing Streaks</Text>
          </View>
        ),
        Footer: () => (
          <TouchableOpacity style={styles.center}>
            <View style={styles.footerButtRad}>
              <LinearGradient
                style={styles.footerButton}
                colors={["#00B7C3", "#255153"]}
              >
                <Text style={styles.footerText}>Extend a Challenge</Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>
        ),
        renderItem: ({ item, index }) => (
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
        ),
      },
    }),
    [users]
  );

  const { data, PrimaryActions, Header, Footer, renderItem, listProps } =
    tabs[curTab];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.gradContainer}>
          <View style={styles.borderRad}>
            <LinearGradient style={styles.grad} colors={["#3C8D90", "#08323F"]}>
              <View>
                <View
                  style={[styles.hRow, styles.spaceAround, styles.marginBottom]}
                >
                  {Object.values(tabs).map((tab) => (
                    <TouchableOpacity
                      style={styles.typeButton}
                      key={tab.type}
                      onPress={() => setCurTab(tab.type)}
                    >
                      <View
                        style={
                          curTab === tab.type
                            ? styles.selectedSpan
                            : styles.spanContainer
                        }
                      >
                        <Text style={styles.spanText}>{tab.title}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
                <PrimaryActions />
              </View>
            </LinearGradient>
          </View>
        </View>
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContainer}
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListHeaderComponent={<Header />}
          ListFooterComponent={<Footer />}
          {...listProps}
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
  gradContainer: {
    backgroundColor: "#fff",
  },
  borderRad: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: "hidden",
  },
  grad: {
    paddingVertical: 32,
  },
  list: {
    // flex: 1,
    // padding: 16,
    // marginTop: 8,
    // padding: 16,
    // backgroundColor: "red",
  },
  listContainer: {
    padding: 16,
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
  typeButton: {
    flex: 1,
  },
  selectedSpan: {
    borderBottomWidth: 3,
    borderBottomColor: "#46FFD4",
    alignItems: "center",
    paddingBottom: 8,
  },
  spanContainer: {
    borderBottomWidth: 3,
    borderBottomColor: "#FDFFFF",
    alignItems: "center",
    paddingBottom: 8,
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
  headerContainer: {
    marginBottom: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  footerButton: {
    paddingVertical: 20,
    paddingHorizontal: 48,
  },
  footerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  footerButtRad: {
    borderRadius: 64,
    overflow: "hidden",
  },
});

export default LeaderboardScreen;
