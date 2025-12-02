import { View, Text, StyleSheet, type DimensionValue } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Shadow } from "react-native-shadow-2";
import DownloadCourseButton from "@/components/Courses/CourseCard/DownloadCourseButton";
import { colors } from "@/theme/colors";
import { t } from "@/i18n";
import { Course, ProgressTuple } from "@/types";

interface CourseInfoCardProps {
  course: Course;
  progress: ProgressTuple;
  points: number;
}

const styles = StyleSheet.create({
  shadowContainer: {
    width: "100%",
    borderRadius: 16,
  },
  statsRow: {
    gap: 4,
  },
  statsText: {
    fontSize: 14,
  },
});

export const CourseInfoCard = ({
  course,
  progress,
  points,
}: CourseInfoCardProps): JSX.Element => {
  const progressBarStyle = {
    width: `${String(progress[0])}%` as DimensionValue,
    backgroundColor: colors.surfaceDefaultCyan,
  };

  return (
    <View>
      <Shadow
        startColor="#28363E14"
        distance={4}
        offset={[0, 4]}
        style={styles.shadowContainer}
      >
        <View className="rounded-large bg-surfaceSubtleGrayscale p-4">
          {/* Title + Download Button */}
          <View className="mb-3 flex-row items-center justify-between">
            <Text
              className="mr-2 flex-1 text-h3-sm-regular"
              style={{ color: colors.textTitleGrayscale }}
            >
              {course.title}
            </Text>
            <DownloadCourseButton course={course} disabled={true} />
          </View>

          {/* Progress Bar - Custom Implementation */}
          <View className="mb-3">
            <View
              className="h-2 w-full overflow-hidden rounded-full"
              style={{ backgroundColor: colors.surfaceLighterCyan }}
            >
              <View className="h-full rounded-full" style={progressBarStyle} />
            </View>
          </View>

          {/* Progress Stats Row */}
          <View className="flex-row items-center justify-between">
            {/* Left: Points */}
            <View className="flex-row items-center" style={styles.statsRow}>
              <MaterialCommunityIcons
                name="crown"
                size={16}
                color={colors.surfaceYellow}
              />
              <Text
                className="text-body-regular"
                style={[{ color: colors.textBodyGrayscale }, styles.statsText]}
              >
                {points} {t("course.points")}
              </Text>
            </View>

            {/* Right: Percentage Completed */}
            <View className="flex-row items-center" style={styles.statsRow}>
              <MaterialCommunityIcons
                name="lightning-bolt"
                size={16}
                color={colors.surfaceYellow}
              />
              <Text
                className="text-body-regular"
                style={[{ color: colors.textBodyGrayscale }, styles.statsText]}
              >
                {progress[0]}% {t("course.completed-low")}
              </Text>
            </View>
          </View>
        </View>
      </Shadow>
    </View>
  );
};
