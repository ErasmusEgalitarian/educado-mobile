import { View, TouchableOpacity, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Shadow } from "react-native-shadow-2";
import { t } from "@/i18n";
type Icons = keyof typeof MaterialCommunityIcons.glyphMap;

export interface SectionCardProps {
  numOfEntries: number;
  title: string;
  progress: number;
  onPress: () => void;
  icon: Icons;
  disabled?: boolean;
  disabledIcon?: Icons;
  disableProgressNumbers?: boolean;
}

/**
 * Section card.
 *
 * @param numOfEntries
 * @param title
 * @param progress
 * @param onPress
 * @param disabled
 * @param icon
 * @param disabledIcon
 * @param disableProgressNumbers
 */
export const SectionCard = ({
  numOfEntries,
  title,
  progress,
  onPress,
  disabled,
  icon,
  disabledIcon,
  disableProgressNumbers,
}: SectionCardProps) => {
  disableProgressNumbers ??= false;
  const isComplete = progress === numOfEntries;
  const inProgress = 0 < progress && progress < numOfEntries;
  const progressText = isComplete
    ? t("course.completed-up")
    : inProgress
      ? t("course.in-progress")
      : t("course.not-started");
  const progressTextColor = isComplete
    ? "text-success"
    : disabled
      ? "text-greyscaleTexticonDisabled"
      : "text-greyscaleTexticonSubtitle";
  disabledIcon = disabledIcon ?? "lock-outline";

  return (
    <View className="mx-[18] mb-[20]">
      <Shadow
        startColor="#28363E14"
        distance={6}
        offset={[0, 3]}
        style={{ width: "100%" }}
      >
        <TouchableOpacity
          className={!disabled ? "bg-surfaceSubtleGrayscale" : "bg-disabled"}
          style={{ borderRadius: 15, transform: [{ scale: 1.02 }] }}
          onPress={onPress}
          disabled={disabled}
        >
          <View className="flex-row items-center justify-between px-[25] py-[15]">
            <View>
              <Text className="mb-2 text-greyscaleTexticonBody text-body-regular">
                {title}
              </Text>

              <View className="flex-row items-center">
                <Text className={`text-subtitle-regular ${progressTextColor}`}>
                  {disableProgressNumbers
                    ? ""
                    : `${String(progress)}/${String(numOfEntries)} `}
                  {progressText}
                </Text>
              </View>
            </View>
            {disabled ? (
              <MaterialCommunityIcons
                testID="chevron-right"
                name={disabledIcon}
                size={25}
                color="gray" //grayscale primary caption
              />
            ) : (
              <MaterialCommunityIcons
                testID="chevron-right"
                name={icon}
                size={25}
                color="gray" // greyscale primary subtle
              />
            )}
          </View>
        </TouchableOpacity>
      </Shadow>
    </View>
  );
};
