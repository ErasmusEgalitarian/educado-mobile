import { View, Pressable, ImageBackground } from "react-native";
import { useEffect, useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import Text from "../../General/Text";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomProgressBar from "../../Exercise/CustomProgressBar";
import tailwindConfig from "../../../tailwind.config.js";
import {
  determineIcon,
  determineCategory,
  formatHours,
  checkProgressCourse,
} from "../../../services/utils";
import DownloadCourseButton from "./DownloadCourseButton";
import PropTypes from "prop-types";
import { checkCourseStoredLocally } from "../../../services/storage-service";
import { getBucketImage } from "../../../api/api";

/**
 * CourseCard component displays a card for a course with its details
 * @param {Object} props - Component props
 * @param {Object} props.course - Course object containing course details
 * @returns {JSX.Element} - Rendered component
 */
export default function CourseCard({ course, isOnline }) {
  const [downloaded, setDownloaded] = useState(false);
  const navigation = useNavigation();
  const [studentProgress, setStudentProgress] = useState(0);
  const [coverImage, setCoverImage] = useState(null);
  const prevCourseId = useRef(null);

  const checkDownload = async () => {
    setDownloaded(await checkCourseStoredLocally(course.courseId));
  };
  checkDownload();

  const checkProgress = async () => {
    const progress = await checkProgressCourse(course.courseId);
    setStudentProgress(progress);
  };
  checkProgress();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const image = await getBucketImage(course.courseId + "_c");
        if (typeof image === "string") {
          setCoverImage(image);
        } else {
          throw new Error();
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (course !== null && course.courseId !== prevCourseId.current) {
      setCoverImage(null); // Reset coverImage state
      fetchImage();
      prevCourseId.current = course.courseId;
    }
  }, [course]);

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
      onPress={() =>
        layout === enabledUI
          ? navigation.navigate("CourseOverview", {
              course: course,
            })
          : null
      }
    >
      <View>
        <ImageBackground source={{ uri: coverImage }}>
          {coverImage && (
            <View className="rounded-lg" style={{ height: 110 }} />
          )}
          <View className="relative">
            <View className="absolute bottom-0 left-0 right-0 top-0 bg-projectWhite opacity-95" />
            <View className="p-[5%]">
              <View className="flex flex-col">
                <View className="flex-row items-start justify-between px-[1%] py-[1%]">
                  <Text className="flex-1 self-center font-montserrat-semi-bold text-[18px] text-projectBlack">
                    {course.title ? course.title : "Título do curso"}
                  </Text>
                  <View className="flex-row items-center">
                    <DownloadCourseButton
                      course={course}
                      disabled={isDisabled}
                    />
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
                    layout === enabledUI
                      ? navigation.navigate("CourseOverview", {
                          course: course,
                        })
                      : null;
                  }}
                >
                  <MaterialCommunityIcons
                    size={28}
                    name="play-circle"
                    color={tailwindConfig.theme.colors.primary_custom}
                  ></MaterialCommunityIcons>
                </Pressable>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    </Pressable>
  );
}

CourseCard.propTypes = {
  course: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  isOnline: PropTypes.bool,
};
