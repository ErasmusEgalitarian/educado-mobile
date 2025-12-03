import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLeaderboardDataAndUserRank } from "@/api/legacy-api";
import { getUserInfo } from "@/services/storage-service";
import LeaveButton from "@/components/Exercise/LeaveButton";
import { LeaderboardUser } from "@/types";
import { cn } from "@/services/utils";

const capitalize = (str: string) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

const getInitials = (name: string) => {
  if (!name) return "";
  const nameParts = name.split(" ");
  return nameParts.length >= 2
    ? `${capitalize(nameParts[0][0])}${capitalize(nameParts[1][0])}`
    : capitalize(name[0]);
};

const getSizeClasses = (rank: number): string => {
  const map: Record<number, string> = {
    1: "w-[100px] h-[100px]",
    2: "w-[70px] h-[70px]",
    3: "w-[60px] h-[60px]",
  };
  return map[rank];
};

const getFontSizeClasses = (rank: number): string => {
  const map: Record<number, string> = {
    1: "text-h1-sm-bold",
    2: "text-h2-sm-bold",
    3: "text-subtitle-semibold",
  };
  return map[rank];
};

const truncateName = (
  name: string,
  containerWidth: number,
  fontSize: number,
) => {
  if (!name) return "";
  const capitalized = name.split(" ").map(capitalize).join(" ");
  const maxWidth = containerWidth - 60;
  const charWidth = fontSize * 0.5;
  const maxChars = Math.floor(maxWidth / charWidth);
  return capitalized.length > maxChars
    ? `${capitalized.substring(0, maxChars)}...`
    : capitalized;
};

const TopLeaderboardUsers = ({
  score,
  profilePicture,
  username,
  rank,
}: LeaderboardUser) => (
  <View className="w-[120px] items-center rounded-lg py-2.5">
    <Text className="text-subtitle-semibold">{score} pts</Text>

    <View className="mb-2">
      <View
        className={cn(
          "relative items-center justify-center rounded-full bg-bgPrimary",
          getSizeClasses(rank),
        )}
      >
        {profilePicture ? (
          <Image
            source={{ uri: profilePicture }}
            className={cn("rounded-full", getSizeClasses(rank))}
          />
        ) : (
          <Text
            className={cn(
              "text-surfaceSubtleGrayscale",
              getFontSizeClasses(rank),
            )}
          >
            {getInitials(username)}
          </Text>
        )}
        <View className="absolute -bottom-[10px] items-center justify-center rounded-[12px] bg-surfaceYellow px-2 py-1">
          <Text className="text-caption-sm-semibold">{rank}º</Text>
        </View>
      </View>
    </View>
    <Text className="subtitle-semibold">{username}</Text>
  </View>
);

interface LeaderboardListProps extends LeaderboardUser {
  highlight: boolean;
}

const LeaderboardList = ({
  rank,
  score,
  profilePicture,
  username,
  highlight,
}: LeaderboardListProps) => (
  <View className="self-stretch px-[15px]">
    <View
      className={cn(
        "mb-0 flex-row items-center rounded-[10px] p-[10px]",
        highlight ? "bg-surfaceLighterCyan" : "bg-surfaceSubtleGrayscale",
      )}
    >
      <Text
        className={cn(
          "min-w-[40px] text-center text-h4-sm-bold",
          highlight && "text-surfaceSubtleGrayscale",
        )}
      >
        {rank}
      </Text>
      <View
        className={cn(
          "mx-[10px] h-[51px] w-[51px] items-center justify-center rounded-[25.5px] border-[3px] bg-surfaceLighterCyan",
          highlight
            ? "border-surfaceSubtleGrayscale"
            : "border-borderSubtleCyan",
        )}
      >
        {profilePicture ? (
          <Image
            source={{ uri: profilePicture }}
            className="h-[45px] w-[45px] rounded-full"
          />
        ) : (
          <Text className="text-surfaceSubtleGrayscale text-body-bold">
            {getInitials(username)}
          </Text>
        )}
      </View>
      <Text
        className={cn(
          "flex-1",
          highlight
            ? "text-surfaceSubtleGrayscale text-body-bold"
            : "text-body-regular",
        )}
      >
        {truncateName(username, 200, 18)}
      </Text>
      <Text
        className={cn(
          "text-body-regular",
          highlight && "text-surfaceSubtleGrayscale",
        )}
      >
        {score} pts
      </Text>
    </View>
  </View>
);

interface LeaderboardRestProps {
  users: LeaderboardUser[];
  rank: number | null;
}

const LeaderboardRest = ({ users, rank }: LeaderboardRestProps) => {
  if (rank === null) {
    return null;
  }
  if (rank <= 30) {
    return users
      .slice(0, 27)
      .map((user) => (
        <LeaderboardList
          key={`${String(user.rank)}-${user.username}`}
          rank={user.rank}
          score={user.score}
          profilePicture={user.profilePicture}
          username={user.username}
          highlight={user.rank === rank}
        />
      ));
  } else {
    const topTenUsers = users.slice(0, 7); /// How many users to show before skipping, Remember to -3 cuz we skip the first 3
    const currentUserIndex = users.findIndex((user) => user.rank === rank);
    const adjacentUsers = users.slice(
      Math.max(currentUserIndex - 1, 0),
      Math.min(currentUserIndex + 2, users.length),
    );

    return (
      <>
        {topTenUsers.map((user) => (
          <LeaderboardList
            key={`${String(user.rank)}-${user.username}`}
            rank={user.rank}
            score={user.score}
            profilePicture={user.profilePicture}
            username={user.username}
            highlight={user.rank === rank}
          />
        ))}
        <Text className="my-2.5 text-center text-h2-sm-regular">⋮</Text>
        {adjacentUsers.map((user) => (
          <LeaderboardList
            key={`${String(user.rank)}-${user.username}`} // Ensure unique keys
            rank={user.rank}
            score={user.score}
            profilePicture={user.profilePicture}
            username={user.username}
            highlight={user.rank === rank}
          />
        ))}
      </>
    );
  }
};

interface LeaderboardTopThreeProps {
  users: LeaderboardUser[];
}

const LeaderboardTopThree = ({ users }: LeaderboardTopThreeProps) => {
  return (
    <View className="mb-[20px] flex-row items-center justify-around px-[10px]">
      {users[1] && (
        <TopLeaderboardUsers
          score={users[1].score}
          profilePicture={users[1].profilePicture}
          username={users[1].username}
          rank={users[1].rank}
        />
      )}
      {users[0] && (
        <TopLeaderboardUsers
          score={users[0].score}
          profilePicture={users[0].profilePicture}
          username={users[0].username}
          rank={users[0].rank}
        />
      )}
      {users[2] && (
        <TopLeaderboardUsers
          score={users[2].score}
          profilePicture={users[2].profilePicture}
          username={users[2].username}
          rank={users[2].rank}
        />
      )}
    </View>
  );
};

const LeaderboardScreen = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [currentUserRank, setCurrentUserRank] = useState<null | number>(null);
  const scrollViewRef = useRef<ScrollView | null>(null);

  const loadMoreData = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("@loginToken");
      if (!token) throw new Error("User not authenticated");
      const userInfo = await getUserInfo(); // Get user info
      const { leaderboard } = await getLeaderboardDataAndUserRank({
        page,
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
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : "Server could not be reached";

      Alert.alert("Error", message);
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
        timeInterval: "all",
        limit: 12,
        userId: userInfo.id,
      }); // Pass user ID
      setLeaderboardData(response.leaderboard);
      setCurrentUserRank(response.currentUserRank);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : "Server could not be reached";

      Alert.alert("Error", message);
    }
  };

  const initializeLeaderboard = async () => {
    try {
      const token = await AsyncStorage.getItem("@loginToken");
      if (!token) throw new Error("User not authenticated");
      const userInfo = await getUserInfo(); // Get user info
      const response = await getLeaderboardDataAndUserRank({
        page: 1,
        timeInterval: "all",
        limit: 12,
        userId: userInfo.id,
      }); // Pass user ID
      setLeaderboardData(response.leaderboard);
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
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : "Server could not be reached";

      Alert.alert("Error", message);
      setLoading(false);
    }
  };

  useEffect(() => {
    void initializeLeaderboard();
  }, []);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;
    if (isCloseToBottom && !loading) {
      void (async () => {
        await loadMoreData();
        await refreshLeaderboard();
      })();
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-surfaceSubtleCyan pt-[40px]">
      <View className="w-full flex-row items-center px-[10px]">
        <LeaveButton navigationPlace="ProfileHome" />
        <Text className="my-[10px] flex-1 text-center text-h2-sm-bold">
          Ranking
        </Text>
        <View className="w-[50px]" />
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
        <LeaderboardTopThree users={leaderboardData.slice(0, 3)} />
        <LeaderboardRest
          users={leaderboardData.slice(3)}
          rank={currentUserRank}
        />
        {loading && <ActivityIndicator size="large" color="#87CEEB" />}
      </ScrollView>
    </View>
  );
};

export default LeaderboardScreen;
