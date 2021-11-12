import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useQuery } from "react-query";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { view } from "@risingstack/react-easy-state";
import type { TabNavParamList } from "../types";
import { fetchUsers } from "../../../actions/user";
import { fetchChallenges } from "../../../actions/challenge";
import type { UserType } from "../../../types/User";
import type { ChallengeType } from "../../../types/Challenge";
import { StackNavParamList } from "../types";

dayjs.extend(relativeTime);

type PropTypes = CompositeScreenProps<
  BottomTabScreenProps<TabNavParamList, "Leaderboard">,
  NativeStackScreenProps<StackNavParamList>
>;

enum TabTypes {
  LEADERBOARD,
  CHALLENGES,
  MONTH,
}

const badges = [
  {
    id: "1",
    title: "Vegan Vigilantes",
    icon: require("../../../../assets/icons/leafs.png"),
  },
  {
    id: "2",
    title: "Big Brunch Fans",
    icon: require("../../../../assets/icons/pancake.png"),
  },
  {
    id: "3",
    title: "Desi Divas",
    icon: require("../../../../assets/icons/mountain.png"),
  },
];

const LeaderboardScreen: React.FC<PropTypes> = () => {
  const [curTab, setCurTab] = React.useState<TabTypes>(TabTypes.LEADERBOARD);
  const { data: users } = useQuery<UserType[], Error>(["users"], fetchUsers, {
    initialData: [],
  });
  const { data: challenges } = useQuery<ChallengeType[], Error>(
    ["challenges"],
    fetchChallenges,
    {
      initialData: [],
    }
  );

  const tabs = React.useMemo(
    () => ({
      [TabTypes.LEADERBOARD]: {
        type: TabTypes.LEADERBOARD,
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
        title: "Challenges",
        data: challenges,
        listProps: {},
        PrimaryActions: () => (
          <View>
            <Text style={[styles.headerText, styles.marginBottom]}>
              Join a badge challenge
            </Text>
            <FlatList
              contentContainerStyle={styles.center}
              horizontal
              data={badges}
              renderItem={({ item }) => (
                <TouchableOpacity>
                  <View style={styles.badge}>
                    <ImageBackground
                      style={[styles.badgeHex, styles.marginBottom]}
                      source={require("../../../../assets/icons/hexagon.png")}
                      resizeMode="contain"
                    >
                      <Image style={styles.badgeIcon} source={item.icon} />
                    </ImageBackground>
                    <Text style={styles.badgeText} numberOfLines={1}>
                      {item.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
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
        renderItem: ({ item }: { item: ChallengeType }) => (
          <View style={styles.listItem}>
            <ImageBackground
              style={styles.hexagon}
              source={require("../../../../assets/icons/hexagon.png")}
              resizeMode="contain"
            >
              <Image
                style={styles.challengeIcon}
                source={{
                  uri: item.iconUrl,
                }}
              />
            </ImageBackground>
            <View>
              <Text style={styles.itemText}>{item.name}</Text>
              <Text style={styles.itemSubtext}>
                {dayjs().to(item.expiresAt, true)} Left
              </Text>
              {item?.completedBy?.length > 0 && (
                <Text style={styles.itemSubtext}>
                  @
                  {item?.completedBy
                    ?.map((id) => users.find((i) => i._id === id).username)
                    .join(", @")}
                </Text>
              )}
            </View>
          </View>
        ),
      },
    }),
    [users, challenges]
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
          contentContainerStyle={styles.listContainer}
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListHeaderComponent={<Header />}
          ListFooterComponent={() => (
            <View style={styles.footerContainer}>
              <Footer />
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
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
  listContainer: {
    paddingVertical: 16,
  },
  listItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 12,
  },
  listSeparator: {
    height: 1,
    backgroundColor: "#DBDBDB",
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
  itemSubtext: {
    fontSize: 16,
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
    paddingBottom: 16,
    borderColor: "#DBDBDB",
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  footerContainer: {
    paddingTop: 16,
    borderColor: "#DBDBDB",
    borderTopWidth: 1,
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
  challengeIcon: {
    width: 50,
    height: 50,
    borderRadius: 32,
    marginHorizontal: 12,
    resizeMode: "contain",
    padding: 4,
  },
  hexagon: {
    width: 75,
    height: 75,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    marginHorizontal: 8,
  },
  badgeHex: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeIcon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  badgeText: {
    width: 84,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    overflow: "hidden",
  },
});

export default view(LeaderboardScreen);
