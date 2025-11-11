import { Alert, Text, TouchableOpacity, View } from "react-native";
import { ResizeMode, Video } from "expo-av";
import { Icon } from "@rneui/themed";
import { getVideoURL } from "@/services/storage-service";
import { Course, Lecture, SectionComponentLecture } from "@/types";
import axios from "axios";
import { t } from "@/i18n";
import { useQuery } from "@tanstack/react-query";

export interface VideoLectureProps {
  lecture: SectionComponentLecture;
  course: Course;
  onContinue: () => Promise<void>;
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
 */
export const VideoLecture = ({
  lecture,
  course,
  onContinue,
}: VideoLectureProps) => {
  const currentResolution = "1080";

  const {
    data: url,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["video-url", lecture.content, currentResolution, lecture],
    queryFn: () => fetchVideoUrl(lecture, currentResolution),
  });

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
            <VideoView
              // @ts-expect-error At this point the URL is fully loaded and not `undefined`.
              source={url}
              autoPlay={true}
              loop={true}
              player={player}
              contentFit="cover"
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
          onPress={() => void onContinue()}
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
