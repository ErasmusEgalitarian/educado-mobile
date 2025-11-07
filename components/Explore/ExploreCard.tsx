import { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CardLabel } from "@/components/Explore/CardLabel";
import { CustomRating } from "@/components/Explore/CustomRating";
import * as Utility from "@/services/utils";
import { colors } from "@/theme/colors";
import { BottomDrawer } from "@/components/Explore/BottomDrawer";
import type { Course } from "@/types";
import { t } from "@/i18n";

export interface ExploreCardProps {
  course: Course;
  isPublished: boolean;
  subscribed: boolean;
}

const styles = StyleSheet.create({
  shadow: {
    backgroundColor: colors.surfaceSubtleGrayscale,
    elevation: 2,
  },
});

/**
 * This component is used to display a course card.
 * @param course - The course object to be displayed.
 * @param isPublished - Boolean value that indicates if the course is published. If false, the card will not be displayed.
 * @param subscribed - Boolean value that indicates if the user is subscribed to the course.
 * @returns Returns a JSX element. If the course is not published, returns null.
 */
export const ExploreCard = ({
  course,
  isPublished,
  subscribed,
}: ExploreCardProps) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<boolean>(false);

  const handleToggleBottomSheet = () => {
    setIsBottomSheetOpen(!isBottomSheetOpen);
  };

  return isPublished ? (
    <View
      className="mx-1 mb-4 overflow-visible rounded-lg p-5"
      style={styles.shadow}
    >
      <View>
        <View className="flex-col items-center">
          <View className="w-full flex-row items-center justify-between">
            <View className="flex-row items-center">
              <MaterialCommunityIcons
                name="chart-bar-stacked"
                size={24}
                color={colors.textTitleGrayscale}
              />
              <Text className="ml-2 mr-9 h-6 text-textTitleGrayscale text-subtitle-semibold">
                {course.title}
              </Text>
            </View>
          </View>

          <View className="h-1 w-full border-b-[1px] border-surfaceDisabledGrayscale pt-3 opacity-50" />

          <View className="h-[0.5] w-full pt-2" />
          <View className="w-full flex-row items-start justify-between">
            <View className="w-full flex-col items-start justify-between">
              <View className="flex-col items-start justify-start space-y-2 pb-0">
                <CardLabel
                  title={Utility.determineCategory(course.category)}
                  icon={Utility.determineIcon(course.category)}
                  font="text-caption-sm-regular"
                  color="textCaptionGrayscale"
                />
                <View className="mb-1 w-2.5" />
                <CardLabel
                  title={Utility.formatHours(course.estimatedHours)}
                  icon={"clock-outline"}
                  font="text-caption-sm-regular"
                  color="textCaptionGrayscale"
                />
                <View className="mb-1 w-2.5" />
                <CardLabel
                  title={Utility.getDifficultyLabel(course.difficulty)}
                  icon={"book-multiple-outline"}
                  font="text-caption-sm-regular"
                  color="textCaptionGrayscale"
                />
              </View>
              <CustomRating rating={course.rating} />

              <View className="w-full flex-row justify-end">
                <TouchableOpacity
                  onPress={handleToggleBottomSheet}
                  className="flex-row items-center border-b border-surfaceDefaultCyan px-1"
                >
                  <Text className="mr-1 text-surfaceDefaultCyan text-caption-sm-semibold">
                    {t("learn-more")}
                  </Text>
                  <MaterialCommunityIcons
                    name="chevron-double-right"
                    color={colors.surfaceDefaultCyan}
                    size={12}
                  />
                </TouchableOpacity>
                <BottomDrawer
                  toggleModal={handleToggleBottomSheet}
                  course={course}
                  drawerState={isBottomSheetOpen}
                  subscribed={subscribed}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  ) : null;
};
