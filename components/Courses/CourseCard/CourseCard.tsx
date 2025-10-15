import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Pressable, View, Text } from "react-native";
import { checkCourseStoredLocally } from "@/services/storage-service";
import {
  checkProgressCourse,
  determineCategory,
  determineIcon,
  formatHours,
} from "@/services/utils";
import { colors } from "@/theme/colors";
import CustomProgressBar from "@/components/Exercise/CustomProgressBar";
import DownloadCourseButton from "@/components/Courses/CourseCard/DownloadCourseButton";
import { t } from "@/i18n";
import { Course } from "@/types/course";

interface CourseCardProps {
  course: Course;
  isOnline: boolean;
}

// eslint-disable-next-line no-undef
const CourseCard = ({ course, isOnline }: CourseCardProps) => {
  const [downloaded, setDownloaded] = useState(false);
  const navigation = useNavigation();
  const [studentProgress, setStudentProgress] = useState(0);

  const checkDownload = async () => {
    setDownloaded((await checkCourseStoredLocally(course.courseId)) || false);
  };

  checkDownload();

  const checkProgress = async () => {
    const progress = await checkProgressCourse(course.courseId);
    setStudentProgress(progress);
  };

  checkProgress();

  const enabledUI =
    "bg-projectWhite rounded-lg elevation-[3] m-[3%] mx-[5%] overflow-hidden";
  const disabledUI =
    "opacity-50 bg-projectWhite rounded-lg elevation-[3] m-[3%] mx-[5%] overflow-hidden";

  const layout = downloaded || isOnline ? enabledUI : disabledUI;

  let isDisabled = layout === disabledUI;

  return (
    <Pressable
      testID="courseCard"
      className={layout}
      onPress={() => {
        if (layout === enabledUI) {
          navigation.navigate(
            ...([
              "CourseOverview",
              {
                course: course,
              },
            ] as never),
          );
        }
      }}
    >
      <View>
        <View className="relative">
          <View className="absolute bottom-0 left-0 right-0 top-0 bg-projectWhite opacity-95" />
          <View className="p-[5%]">
            <View className="flex flex-col">
              <View className="flex-row items-start justify-between px-[1%] py-[1%]">
                <Text
                  style={{
                    fontWeight: "600",
                    flex: 1,
                    alignSelf: "center",
                    fontSize: 18,
                    color: "#000",
                  }}
                >
                  {course.title ? course.title : t("course.course-title")}
                </Text>
                <View className="flex-row items-center">
                  <DownloadCourseButton course={course} disabled={isDisabled} />
                </View>
              </View>
            </View>
            <View className="m-[2%] h-[1] bg-disable" />
            <View className="flex-row flex-wrap items-center justify-start">
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  size={18}
                  name={determineIcon(course.category)}
                  color="gray"
                />
                <Text className="mx-[2.5%] my-[3%]">
                  {determineCategory(course.category)}
                </Text>
              </View>
              <View className="flex-row items-center">
                <MaterialCommunityIcons size={18} name="clock" color="gray" />
                <Text className="mx-[2.5%] my-[3%]">
                  {course.estimatedHours
                    ? formatHours(course.estimatedHours)
                    : t("course.duration")}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <CustomProgressBar
                width={56}
                progress={studentProgress}
                height={1}
              />
              <Pressable
                className="z-[1]"
                onPress={() => {
                  if (layout === enabledUI) {
                    navigation.navigate(
                      ...([
                        "CourseOverview",
                        {
                          course: course,
                        },
                      ] as never),
                    );
                  }
                }}
              >
                <MaterialCommunityIcons
                  size={28}
                  name="play-circle"
                  color={colors?.primary_custom}
                ></MaterialCommunityIcons>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default CourseCard;
