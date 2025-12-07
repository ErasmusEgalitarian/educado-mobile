import { Alert, Text, TouchableOpacity, View } from "react-native";
import { VideoPlayer, VideoView, useVideoPlayer } from "expo-video";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getVideoURL } from "@/services/storage-service";
import { Course, Lecture, SectionComponentLecture } from "@/types";
import axios from "axios";
import { t } from "@/i18n";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export interface VideoLectureProps {
  lecture: SectionComponentLecture;
  course: Course;
  isActive: boolean;
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
  // TODO: The if-statement below is for testing purposes only because the API is not working properly. Remove it when the API is fixed.
  if (__DEV__) {
    return "https://cloud.kristiyan.cc/api/public/dl/KM6xDJyF?inline=true";
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
 */
export const VideoLecture = ({
  lecture,
  course,
  isActive,
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

  const player = useVideoPlayer({ uri: url }, (player: VideoPlayer) => {
    player.loop = true;
  });

  useEffect(() => {
    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, player]);

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
              player={player}
              contentFit="cover"
              nativeControls={false}
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
      <View className="w-100 mb-[80px] px-6">
        <TouchableOpacity
          className="flex-row items-center justify-center rounded-medium bg-surfaceDefaultCyan px-10 py-4"
          onPress={() => void onContinue()}
        >
          <View className="flex-row items-center">
            <Text className="text-center text-surfaceSubtleGrayscale text-body-bold">
              {t("course.continue-button-text")}
            </Text>
            <MaterialCommunityIcons
              name="chevron-right"
              type="material"
              size={24}
              color="white"
              className="ml-2"
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
