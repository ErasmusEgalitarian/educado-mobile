import { Fragment } from "react";
import { View, Text, Image } from "react-native";
import { CustomProgressBar } from "@/components/Exercise/CustomProgressBar";
import { colors } from "@/theme/colors";

type Props = {
  studyStreak?: number;
  points: number;
  leaderboardPosition?: number;
  level: number;
  drawProgressBarOnly: boolean;
};

const ProfileStatsBox = ({
  studyStreak = 0,
  points,
  leaderboardPosition = 0,
  level,
  drawProgressBarOnly,
}: Props) => {
  // Calculate remaining points to next level-up (every 100 points)
  const pointsToNextLevel = 100 - (points % 100);

  // Progress through level (based on level-up for every 100 points)
  // e.g., 42 pts. (out of 100) = 42% progress, 128 pts. (out of 200) = 28% progress, etc.
  const levelProgressPercentage = points % 100;

  return (
    <View className="rounded-lg border border-lightGray p-4">
      {/* Stats */}
      {/* Don't render if drawProgressOnly = true */}
      {!drawProgressBarOnly && (
        <Fragment>
          <View className="mb-4 flex-row items-center justify-between">
            {/* Study streak (number of days in a row with study activity) */}
            <View className="h-16 w-24 flex-1 flex-col items-center rounded-lg bg-badgesGreen py-2">
              <Image source={require("../../assets/images/profileFlame.png")} />
              <Text
                className="text-caption-lg-bold mt-2"
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{ color: colors.surfaceSubtleGrayscale }}
              >
                {studyStreak} dia seguido
              </Text>
            </View>

            {/* Points */}
            <View className="mx-2 h-16 w-24 flex-1 flex-col items-center rounded-lg bg-badgesPurple py-2">
              <Image source={require("../../assets/images/profileCoin.png")} />

              <Text
                className="text-caption-lg-bold mt-2"
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{ color: colors.surfaceSubtleGrayscale }}
              >
                {points} pontos
              </Text>
            </View>

            {/* Leaderboard position */}
            <View className="h-16 w-24 flex-1 flex-col items-center rounded-lg bg-badgesBlue py-2">
              <Image
                source={require("../../assets/images/profileLightning.png")}
              />
              <Text
                className="text-caption-lg-bold mt-2"
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{ color: colors.surfaceSubtleGrayscale }}
              >
                {leaderboardPosition}º posição
              </Text>
            </View>
          </View>

          {/* Border divider line */}
          <View className="-mx-4 mb-4 border-t border-lightGray"></View>
        </Fragment>
      )}

      {/* Level and progress bar */}
      <View className="mb-2 flex flex-row justify-between">
        <Text
          className="caption-lg-semibold"
          style={{ color: colors.textLabelDefault }}
        >
          Nível {level}
        </Text>
        <CustomProgressBar
          progress={[levelProgressPercentage, 0, 0]}
          width={65}
          height={1}
          displayLabel={false}
        />
      </View>

      {/* Remaining points to next level-up */}
      <View>
        <Text
          className="text-caption-sm-regular"
          numberOfLines={2}
          adjustsFontSizeToFit
          style={{ color: colors.textLabelCyan }}
        >
          Faltam apenas <Text>{pointsToNextLevel} pts.</Text> para você mudar de
          nível, continue estudando para chegar lá 🥳
        </Text>
      </View>
    </View>
  );
};

export default ProfileStatsBox;
