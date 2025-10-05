import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLeaderboardDataAndUserRank } from "../../api/api";
import DefaultTheme from "../../theme/colors"; // import the theme colors
import { getUserInfo } from "../../services/storage-service"; // import getUserInfo
import PropTypes from "prop-types"; // import PropTypes
import LeaveButton from "../../components/Exercise/LeaveButton"; // import LeaveButton

const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

const getInitials = (name) => {
  if (!name) return "";
  const nameParts = name.split(" ");
  return nameParts.length >= 2
    ? `${capitalize(nameParts[0][0])}${capitalize(nameParts[1][0])}`
    : capitalize(name[0]);
};

const getSizeStyle = (rank) => {
  const sizes = { 1: 100, 2: 70, 3: 60, default: 70 };
  const size = sizes[rank] || sizes.default;
  return { width: size, height: size, borderRadius: size / 2 };
};

const getFontSizeStyle = (rank) => {
  const fontSizes = { 1: 40, 2: 25, 3: 15, default: 28 };
  return { fontSize: fontSizes[rank] || fontSizes.default };
};

const truncateName = (name, containerWidth, fontSize) => {
  if (!name) return "";
  const capitalized = name.split(" ").map(capitalize).join(" ");
  const maxWidth = containerWidth - 60;
  const charWidth = fontSize * 0.5;
  const maxChars = Math.floor(maxWidth / charWidth);
  return capitalized.length > maxChars
    ? `${capitalized.substring(0, maxChars)}...`
    : capitalized;
};

const TopLeaderboardUsers = ({ points, profilePicture, username, rank }) => (
  <View style={styles.topContainer}>
    <Text style={[styles.points]}>{points} pts</Text>

    <View style={styles.circleContainer}>
      <View style={[styles.circle, getSizeStyle(rank)]}>
        {profilePicture ? (
          <Image
            source={{ uri: profilePicture }}
            style={[styles.profileImage, getSizeStyle(rank)]}
          />
        ) : (
          <Text style={[styles.un, getFontSizeStyle(rank)]}>
            {getInitials(username)}
          </Text>
        )}
        <View style={[styles.rank]}>
          <Text style={[styles.rankText]}>{rank}º</Text>
        </View>
      </View>
    </View>
    <Text style={[styles.userName]}>{truncateName(username)}</Text>
  </View>
);

TopLeaderboardUsers.propTypes = {
  points: PropTypes.number.isRequired,
  profilePicture: PropTypes.string,
  username: PropTypes.string.isRequired,
  rank: PropTypes.number.isRequired,
  highlight: PropTypes.bool,
};

const LeaderboardList = ({
  rank,
  points,
  profilePicture,
  username,
  highlight,
}) => (
  <View style={styles.listRoot}>
    <View style={[styles.listContainer, highlight && styles.highlight]}>
      <Text style={[styles.listRank, highlight && styles.highlightText]}>
        {rank}
      </Text>
      <View style={[styles.frame2273, highlight && styles.highlightBorder]}>
        {profilePicture ? (
          <Image
            source={{ uri: profilePicture }}
            style={styles.listProfileImage}
          />
        ) : (
          <Text style={[styles.un, highlight && styles.highlightText]}>
            {getInitials(username)}
          </Text>
        )}
      </View>
      <Text
        style={[
          styles.listUserName,
          highlight && styles.highlightText,
          highlight && styles.boldText,
        ]}
      >
        {truncateName(username, 200, 18)}
      </Text>
      <Text style={[styles.listPoints, highlight && styles.highlightText]}>
        {points} pts
      </Text>
    </View>
  </View>
);

LeaderboardList.propTypes = {
  rank: PropTypes.number.isRequired,
  points: PropTypes.number.isRequired,
  profilePicture: PropTypes.string,
  username: PropTypes.string.isRequired,
  highlight: PropTypes.bool,
};

export function LeaderboardScreen() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const scrollViewRef = useRef(null);

  const loadMoreData = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("@loginToken");
      if (!token) throw new Error("User not authenticated");
      const userInfo = await getUserInfo(); // Get user info
      const { leaderboard } = await getLeaderboardDataAndUserRank({
        page,
        token,
        timeInterval: "all",
        limit: 12,
        userId: userInfo.id,
      }); // Pass user ID
      if (leaderboard.length === 0) return;
      setLeaderboardData((prevData) => {
        const newData = leaderboard.filter(
          (item) => !prevData.some((prevItem) => prevItem.rank === item.rank),
        );
        return [...prevData, ...newData];
      });
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error loading more data:", error);
      Alert.alert("Error", error.message || "Server could not be reached");
    } finally {
      setLoading(false);
    }
  };

  const refreshLeaderboard = async () => {
    try {
      const token = await AsyncStorage.getItem("@loginToken");
      if (!token) throw new Error("User not authenticated");
      const userInfo = await getUserInfo(); // Get user info
      const response = await getLeaderboardDataAndUserRank({
        page: 1,
        token,
        timeInterval: "all",
        limit: 12,
        userId: userInfo.id,
      }); // Pass user ID
      setLeaderboardData(response.leaderboard || []);
      setCurrentUserRank(response.currentUserRank);
    } catch (error) {
      console.error("Error refreshing leaderboard:", error);
      Alert.alert("Error", error.message || "Server could not be reached");
    }
  };

  const initializeLeaderboard = async () => {
    try {
      const token = await AsyncStorage.getItem("@loginToken");
      if (!token) throw new Error("User not authenticated");
      const userInfo = await getUserInfo(); // Get user info
      const response = await getLeaderboardDataAndUserRank({
        page: 1,
        token,
        timeInterval: "all",
        limit: 12,
        userId: userInfo.id,
      }); // Pass user ID
      setLeaderboardData(response.leaderboard || []);
      setCurrentUserRank(response.currentUserRank);
      setLoading(false);

      if (scrollViewRef.current && response.currentUserRank) {
        const pageToScroll = Math.ceil(response.currentUserRank / 30);
        setPage(pageToScroll);
        scrollViewRef.current.scrollTo({
          y: (response.currentUserRank - 1) * 50,
          animated: true,
        });
      }
    } catch (error) {
      console.error("Error initializing leaderboard:", error);
      Alert.alert("Error", error.message || "Server could not be reached");
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeLeaderboard();
  }, []);

  const handleScroll = async (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;
    if (isCloseToBottom && !loading) {
      await loadMoreData();
      await refreshLeaderboard();
    }
  };

  const renderLeaderboard = () => {
    const remainingUsers = leaderboardData.slice(3);

    if (currentUserRank <= 30) {
      return remainingUsers
        .slice(0, 27)
        .map((user) => (
          <LeaderboardList
            key={`${user.rank}-${user.name}`}
            rank={user.rank}
            points={user.score}
            profilePicture={user.image}
            username={user.name}
            highlight={user.rank === currentUserRank}
          />
        ));
    } else {
      const topTenUsers = remainingUsers.slice(0, 7); /// How many users to show before skipping, Remember to -3 cuz we skip the first 3
      const currentUserIndex = remainingUsers.findIndex(
        (user) => user.rank === currentUserRank,
      );
      const adjacentUsers = remainingUsers.slice(
        Math.max(currentUserIndex - 1, 0),
        Math.min(currentUserIndex + 2, remainingUsers.length),
      );

      return (
        <>
          {topTenUsers.map((user) => (
            <LeaderboardList
              key={`${user.rank}-${user.name}`}
              rank={user.rank}
              points={user.score}
              profilePicture={user.image}
              username={user.name}
            />
          ))}
          <Text style={styles.ellipsis}>⋮</Text>
          {adjacentUsers.map((user) => (
            <LeaderboardList
              key={`${user.rank}-${user.name}`} // Ensure unique keys
              rank={user.rank}
              points={user.score}
              profilePicture={user.image}
              username={user.name}
              highlight={user.rank === currentUserRank}
            />
          ))}
        </>
      );
    }
  };

  const topUsers = leaderboardData.slice(0, 3);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <LeaveButton navigationPlace="ProfileHome" />
        <Text style={styles.rankingText}>Ranking</Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView
        ref={scrollViewRef}
        contentInsetAdjustmentBehavior="never"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never"
      >
        <View style={styles.topUsersContainer}>
          {topUsers[1] && (
            <TopLeaderboardUsers
              points={topUsers[1].score}
              profilePicture={topUsers[1].image}
              username={topUsers[1].name}
              rank={topUsers[1].rank}
              highlight={topUsers[1].rank === currentUserRank}
            />
          )}
          {topUsers[0] && (
            <TopLeaderboardUsers
              points={topUsers[0].score}
              profilePicture={topUsers[0].image}
              username={topUsers[0].name}
              rank={topUsers[0].rank}
              highlight={topUsers[0].rank === currentUserRank}
            />
          )}
          {topUsers[2] && (
            <TopLeaderboardUsers
              points={topUsers[2].score}
              profilePicture={topUsers[2].image}
              username={topUsers[2].name}
              rank={topUsers[2].rank}
              highlight={topUsers[2].rank === currentUserRank}
            />
          )}
        </View>
        {renderLeaderboard()}
        {loading && <ActivityIndicator size="large" color="#87CEEB" />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: DefaultTheme.bgSecondary,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
  },
  headerSpacer: {
    width: 50,
  },
  rankingText: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
    color: "#333333",
    flex: 1,
  },
  topUsersContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  topContainer: {
    width: 120,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
  },
  points: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Montserrat-SemiBold",
    color: "#333333",
    marginBottom: 8,
  },
  circleContainer: {
    marginBottom: 8,
  },
  circle: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: DefaultTheme.bgPrimary,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  un: {
    fontWeight: "700",
    fontFamily: "Montserrat-Bold",
    color: "#FFFFFF",
  },
  rank: {
    position: "absolute",
    bottom: -10,
    backgroundColor: "#FAC12F",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  rankText: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "Montserrat-Bold",
    color: "#2F4858",
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Montserrat-SemiBold",
    color: "#333333",
  },
  listRoot: {
    paddingHorizontal: 15,
    alignSelf: "stretch",
  },
  listContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    marginBottom: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 0,
  },
  listRank: {
    minWidth: 40,
    textAlign: "center",
    fontFamily: "Montserrat-SemiBold",
    fontSize: 18,
    fontWeight: "700",
    color: "#333333",
  },
  frame2273: {
    width: 51,
    height: 51,
    borderRadius: 25.5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    backgroundColor: DefaultTheme.bgPrimary,
    marginHorizontal: 10,
  },
  listProfileImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  listUserName: {
    flex: 1,
    fontFamily: "Montserrat-Regular",
    fontSize: 18,
    fontWeight: "400",
    color: "#333333",
  },
  boldText: {
    fontWeight: "700",
  },
  listPoints: {
    fontFamily: "Montserrat-Regular",
    fontSize: 18,
    fontWeight: "400",
    color: "#333333",
  },
  highlight: {
    backgroundColor: DefaultTheme.bgPrimary,
  },
  highlightText: {
    color: "#FFFFFF",
  },
  highlightBorder: {
    borderColor: "#FFFFFF",
  },
  ellipsis: {
    textAlign: "center",
    fontSize: 24,
    marginVertical: 10,
  },
});

export default LeaderboardScreen;
