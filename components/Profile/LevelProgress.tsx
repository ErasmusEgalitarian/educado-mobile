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
        <Text className="caption-lg-semibold text-textLabelCyan">
          {t("profile.level")}
        </Text>
        <Text className="caption-lg-semibold pl-1 text-textLabelCyan">
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
