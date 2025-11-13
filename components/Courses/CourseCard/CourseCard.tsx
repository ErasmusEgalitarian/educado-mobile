import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { Pressable, View, Text, Image } from "react-native";
import { checkCourseStoredLocally } from "@/services/storage-service";
import {
  getCourseProgress,
  determineCategory,
  determineIcon,
  formatHours,
  cn,
} from "@/services/utils";
import { colors } from "@/theme/colors";
import { CustomProgressBar } from "@/components/Exercise/CustomProgressBar";
import { t } from "@/i18n";
import { Course, ProgressTuple } from "@/types";
import courseTitleIcon from "@/assets/images/course-title-icon.png";
import { useLoginStudent, useSections } from "@/hooks/query";

interface CourseCardProps {
  course: Course;
  isOnline: boolean;
}

interface RootStackParamList {
  CourseOverview: {
    course: Course;
  };
}

const CourseCard = ({ course, isOnline }: CourseCardProps) => {
  const [downloaded, setDownloaded] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [studentProgress, setStudentProgress] = useState<ProgressTuple>([
    0, 0, 0,
  ]);

  const loginStudentQuery = useLoginStudent();
  const sectionQuery = useSections(course.courseId);

  useEffect(() => {
    const checkIsCourseDownloaded = async () => {
      const isDownloaded = await checkCourseStoredLocally(course.courseId);

      setDownloaded(isDownloaded);
    };

    void checkIsCourseDownloaded();
  }, [course.courseId]);

  useEffect(() => {
    if (!sectionQuery.data) {
      return;
    }

    const progress = getCourseProgress(
      loginStudentQuery.data,
      sectionQuery.data,
    );

    setStudentProgress(progress);
  }, [loginStudentQuery.data, sectionQuery.data]);

  const enabledUI = downloaded || isOnline;

  return (
    <Pressable
      testID="courseCard"
      className={cn(
        "elevation-[3] m-2 mx-7 overflow-hidden rounded-lg bg-surfaceSubtleGrayscale",
        enabledUI || "opacity-50",
      )}
      // Pressable doesn't support className
      // eslint-disable-next-line eslint-plugin-react-native/no-inline-styles
      style={{
        backgroundColor: "white",
        borderRadius: 8,
        elevation: 4,
        shadowColor: "#28363E",
      }}
      onPress={() => {
        if (enabledUI) {
          navigation.navigate("CourseOverview", {
            course: course,
          });
        }
      }}
    >
      <View>
        <View className="relative">
          <View className="p-[5%]">
            <View className="flex flex-col">
              <View className="flex-row items-center gap-x-2 px-[1%] py-[1%]">
                <Image source={courseTitleIcon} className="h-[22px] w-[22px]" />
                <Text className="self-center text-textTitleGrayscale text-subtitle-semibold">
                  {course.title}
                </Text>
              </View>
            </View>
            <View className="flex-col items-start justify-start">
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  size={18}
                  name={determineIcon(course.category)}
                  color={colors.textCaptionGrayscale}
                />
                <Text className="mx-[2.5%] my-[3%] text-textCaptionGrayscale text-caption-sm-regular">
                  {determineCategory(course.category)}
                </Text>
              </View>
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  size={18}
                  name="clock"
                  color={colors.textCaptionGrayscale}
                />
                <Text className="mx-[2.5%] my-[3%] text-textCaptionGrayscale text-caption-sm-regular">
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
                  if (enabledUI) {
                    navigation.navigate("CourseOverview", {
                      course,
                    });
                  }
                }}
              >
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={18}
                  color={colors.surfaceDarker}
                />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default CourseCard;
