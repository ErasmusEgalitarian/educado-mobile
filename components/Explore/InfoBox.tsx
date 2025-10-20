import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Utility from "@/services/utils";
import { colors } from "@/theme/colors";
import type { ComponentProps } from "react";
import type { Course } from "@/types/course";
import { t } from "@/i18n";

type MaterialCommunityIconName = ComponentProps<
  typeof MaterialCommunityIcons
>["name"];

export interface InfoBoxItemProps {
  label: string;
  icon: MaterialCommunityIconName;
  className?: string;
}

const InfoBoxItem = ({ label, icon, className }: InfoBoxItemProps) => {
  return (
    <View
      className={`flex-row items-center justify-start py-3 ${className ?? ""}`}
    >
      <MaterialCommunityIcons
        name={icon}
        size={20}
        color={colors.textCaptionGrayscale}
      />
      <Text className="text-label-sm-regular pl-2 text-textTitleGrayscale"> {label} </Text>
    </View>
  );
};

export const InfoBox = ({ course }: { course: Course }) => {
  return (
    <View className="border-textCaptionGrayscale w-full flex-col rounded-2xl border px-4 py-1">
      <InfoBoxItem
        label={`${Utility.formatHours(course.estimatedHours)} ${t("info-box.hours")}`}
        icon="clock-outline"
      />
      <InfoBoxItem
        label={`${t("info-box.level")} ${Utility.getDifficultyLabel(course.difficulty)}`}
        icon="book-multiple-outline"
      />
      <InfoBoxItem
        label={t("info-box.certificate")}
        icon="certificate-outline"
      />
      <InfoBoxItem
        label={t("info-box.start")}
        icon="clock-fast"
      />
      <InfoBoxItem
        label={t("info-box.access-time")}
        icon="calendar-month-outline"
      />
      <InfoBoxItem
        label={t("info-box.portability")}
        icon="cellphone-link"
        className="mb-0"
      />
    </View>
  );
};
