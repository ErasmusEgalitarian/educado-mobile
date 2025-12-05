import { t } from "@/i18n";
import { View, Text } from "react-native";
import { CustomProgressBar } from "@/components/Exercise/CustomProgressBar";

interface LevelProgressProps {
  levelProgressPercentage: number;
  level: number;
}

export const LevelProgress = ({
  levelProgressPercentage,
  level,
}: LevelProgressProps) => {
  return (
    <View className="flex flex-row justify-between">
      <View className="flex flex-row items-center">
        <Text className="text-textLabelDefault text-caption-lg-semibold">
          {t("profile.level")}
        </Text>
        <Text className="pl-1 text-textLabelDefault text-caption-lg-semibold">
          {level}
        </Text>
      </View>
      <CustomProgressBar
        progress={[levelProgressPercentage, 0, 0]}
        width={65}
        height={1}
        displayLabel={false}
      />
    </View>
  );
};
