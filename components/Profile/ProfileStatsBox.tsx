import { View } from "react-native";
import { Badge } from "@/components/Profile/Badge";
import { t } from "@/i18n";
import { LevelProgress } from "@/components/Profile/LevelProgress";

interface ProfileStatsBoxProps {
  studyStreak: number;
  points: number;
  leaderboardPosition: number;
  level: number;
}

const ProfileStatsBox = ({
  studyStreak,
  points,
  leaderboardPosition,
  level,
}: ProfileStatsBoxProps) => {
  const levelProgressPercentage = points % 100;

  return (
    <View className="rounded-xl border border-surfaceDefaultGrayscale">
      <View className="flex-row items-center justify-between p-4">
        <Badge
          className="bg-surfaceDefaultGreen"
          icon={{ name: "fire", color: "orange" }}
        >
          {studyStreak} {t("profile.day_streak")}
        </Badge>
        <Badge
          className="bg-surfaceDefaultPurple"
          icon={{ name: "crown-circle", color: "gold" }}
        >
          {points} {t("profile.points")}
        </Badge>
        <Badge
          className="bg-surfaceDefaultCyan"
          icon={{ name: "lightning-bolt", color: "yellow" }}
        >
          {leaderboardPosition}º {t("profile.position")}
        </Badge>
      </View>
      <View className="h-px bg-surfaceDefaultGrayscale" />
      <View className="p-4">
        <LevelProgress
          levelProgressPercentage={levelProgressPercentage}
          level={level}
        />
      </View>
    </View>
  );
};

export default ProfileStatsBox;
