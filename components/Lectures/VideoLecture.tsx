import { Alert, Text, TouchableOpacity, View } from "react-native";
import { ResizeMode, Video } from "expo-av";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { handleLastComponent } from "@/services/utils";
import { getVideoURL } from "@/services/storage-service";
import {
  Course,
  Lecture,
  SectionComponent,
  SectionComponentLecture,
} from "@/types";
import axios from "axios";
import { t } from "@/i18n";
import { useQuery } from "@tanstack/react-query";
import {
  useCompleteComponent,
  useLoginStudent,
  useStudent,
} from "@/hooks/query";

export interface VideoLectureProps {
  lecture: SectionComponentLecture;
  course: Course;
  isLastSlide: boolean;
  onContinue: () => void;
  handleStudyStreak: () => void;
}

/**
 * Fetches the video URL based on the current resolution.
 *
 * @param lecture - The lecture object containing the video URL.
 * @param currentResolution - The current resolution of the video.
 * @returns The video URL based on the current resolution.
 * @throw {@link AxiosError}
 * If the video URL is invalid.
 */
const fetchVideoUrl = async (lecture: Lecture, currentResolution: string) => {
  // TODO: The if-statement below is for testing purposes only because the API is not working properly. Remove it when the API is fixed.
  if (__DEV__) {
    return "https://educado-backend-staging-x7rgvjso4a-ew.a.run.app/api/bucket/stream/rick_1080x1920.mp4";
  }

  const url = await getVideoURL(lecture.content, currentResolution);

  const response = await axios.get(url, { method: "HEAD" });

  const contentType = response.headers["content-type"] as string | null;

  if (!contentType?.startsWith("video/")) {
    console.error(`Invalid URL: ${url}`);

    throw new Error("Invalid URL");
  }

  return url;
};

/**
 * Displays of a video lecture.
 *
 * @param lecture - The lecture object containing the video URL.
 * @param course - The course object containing the course information.
 * @param isLastSlide - A boolean indicating whether this is the last slide.
 * @param onContinue - A function to be called when the continue button is pressed.
 * @param handleStudyStreak - A function to handle the study streak.
 */
export const VideoLecture = ({
  lecture,
  course,
  isLastSlide,
  onContinue,
  handleStudyStreak,
}: VideoLectureProps) => {
  const navigation = useNavigation();
  const currentResolution = "1080";

  const {
    data: url,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["video-url", lecture.content, currentResolution, lecture],
    queryFn: () => fetchVideoUrl(lecture, currentResolution),
  });

  const loginStudentQuery = useLoginStudent();
  const studentQuery = useStudent(loginStudentQuery.data.userInfo.id);
  const completeComponentQuery = useCompleteComponent();

  const student = studentQuery.data;

  const handleContinuePress = async () => {
    if (!isLastSlide) {
      onContinue();
    }

    if (!student) {
      return;
    }

    try {
      handleStudyStreak();

      completeComponentQuery.mutate({
        student,
        component: lecture,
        isComplete: true,
      });

      const requestObject: SectionComponent<SectionComponentLecture> = {
        type: "lecture",
        component: lecture,
        lectureType: "video",
      };

      // @ts-expect-error Will be refactored when we move to Expo Router
      await handleLastComponent(requestObject, course, navigation);
    } catch (error) {
      console.error("Error completing the course:", error);

      Alert.alert(t("general.error"), t("course.fail"), [{ text: "OK" }]);
    }
  };

  if (error) {
    Alert.alert(t("general.error"), t("lesson.video-error"), [{ text: "OK" }]);

    return;
  }

  return (
    <View className="flex-1 pt-20">
      {/* Course info */}
      <View className="mt-5 flex-col items-center">
        <Text className="text-textDisabledGrayscale text-body-regular">
          Nome do curso: {course.title}
        </Text>
        <Text className="text-textTitleGrayscale text-body-bold">
          {lecture.title}
        </Text>
      </View>

      {/* Video Player */}
      <View className="flex-1 p-8">
        <View
          className="w-full overflow-hidden rounded-xl"
          style={{ aspectRatio: 7 / 10 }}
        >
          {!isLoading ? (
            <Video
              // @ts-expect-error At this point the URL is fully loaded and not `undefined`.
              source={{ uri: url }}
              shouldPlay={true}
              resizeMode={ResizeMode.COVER}
              style={{ width: "100%", height: "100%" } as const}
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text>Loading...</Text>
            </View>
          )}
        </View>
      </View>

      {/* Continue button */}
      <View className="w-100 mb-8 bg-surfaceSubtleCyan px-6">
        <TouchableOpacity
          className="flex-row items-center justify-center rounded-medium bg-surfaceDefaultCyan px-10 py-4"
          onPress={() => void handleContinuePress()}
        >
          <View className="flex-row items-center">
            <Text className="text-center text-surfaceSubtleGrayscale text-body-bold">
              {t("lesson.continue")}
            </Text>
            <MaterialCommunityIcons
              className="ml-8"
              name="chevron-right"
              type="material"
              size={24}
              color="white"
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
