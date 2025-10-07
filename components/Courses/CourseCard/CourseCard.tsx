import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Pressable, View } from "react-native";
import { checkCourseStoredLocally } from "@/services/storage-service";
import {
  checkProgressCourse,
  determineCategory,
  determineIcon,
  formatHours,
} from "@/services/utils";
import colors from "@/theme/colors";
import CustomProgressBar from "@/components/Exercise/CustomProgressBar";
import Text from "@/components/General/Text";
import DownloadCourseButton from "@/components/Courses/CourseCard/DownloadCourseButton";

interface CourseCardProps {
  course: Record<string, any>;
  isOnline: boolean;
}

// eslint-disable-next-line no-undef
const CourseCard: React.FC<CourseCardProps> = ({ course, isOnline }) => {
  const [downloaded, setDownloaded] = useState(false);
  const navigation = useNavigation();
  const [studentProgress, setStudentProgress] = useState(0);

  const checkDownload = useCallback(async () => {
    setDownloaded((await checkCourseStoredLocally(course.courseId)) || false);
  }, [course.courseId]);

  checkDownload();
  const checkProgress = useCallback(async () => {
    const progress = await checkProgressCourse(course.courseId);
    setStudentProgress(progress);
  }, [course.courseId]);

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
                <Text className="flex-1 self-center font-montserrat-semi-bold text-[18px] text-projectBlack">
                  {course.title ? course.title : "Título do curso"}
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
                  color={"gray"}
                ></MaterialCommunityIcons>
                <Text className="mx-[2.5%] my-[3%]">
                  {determineCategory(course.category)}
                </Text>
              </View>
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  size={18}
                  name="clock"
                  color={"gray"}
                ></MaterialCommunityIcons>
                <Text className="mx-[2.5%] my-[3%]">
                  {course.estimatedHours
                    ? formatHours(course.estimatedHours)
                    : "duração"}
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
