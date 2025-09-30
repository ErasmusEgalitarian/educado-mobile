import { useState, useEffect, useRef } from "react";
import { View, Pressable, TouchableOpacity, Alert } from "react-native";
import Text from "../../components/General/Text";
import VideoActions from "../../components/Lectures/VideoActions";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomExpoVideoPlayer from "../../components/Lectures/CustomExpoVideoPlayer";
import ReactSliderProgress from "./ReactSliderProgress";
import PropTypes from "prop-types";
import { Icon } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { completeComponent, handleLastComponent } from "../../services/utils";
import { getVideoURL } from "../../services/storage-service";

const VideoLectureScreen = ({
  lectureObject,
  courseObject,
  isLastSlide,
  onContinue,
  handleStudyStreak,
}) => {
  const navigation = useNavigation();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [showPlayPauseIcon, setShowPlayPauseIcon] = useState(false);
  const [currentResolution, setCurrentResolution] = useState("360");
  const [allResolutions] = useState(["1080", "720", "480", "360"]);

  // Fetch video URL based on current resolution
  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        const url = await getVideoURL(lectureObject.video, currentResolution);
        if (!url) {
          throw new Error("Video URL is null");
        }
        setVideoUrl(url);
      } catch (error) {
        console.error("Error fetching video URL:", error);
        Alert.alert(
          "Error",
          "Failed to load the video. Please try again later.",
          [{ text: "OK" }],
        );
        setVideoUrl(null);
      }
    };
    fetchVideoUrl();
  }, [lectureObject.video, currentResolution]);

  const onStatusUpdate = (status) => {
    setPositionMillis(status.positionMillis || 0);
    setDurationMillis(status.durationMillis || 0);
  };

  const handleContinuePress = async () => {
    if (isLastSlide) {
      try {
        handleStudyStreak();
        await completeComponent(lectureObject, courseObject.courseId, true);
        handleLastComponent(lectureObject, courseObject, navigation);
      } catch (error) {
        console.error("Error completing the course:", error);
        Alert.alert(
          "Error",
          "Failed to complete the course. Please try again later.",
          [{ text: "OK" }],
        );
      }
    } else {
      if (onContinue && typeof onContinue === "function") {
        onContinue(); // Advance to the next slide
      } else {
        console.warn("onContinue prop is not provided or not a function.");
      }
    }
  };

  const handleResolutionChange = (newRes) => {
    setCurrentResolution(newRes);
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
    setShowPlayPauseIcon(true);
    // Hide the icon after 500ms
    setTimeout(() => setShowPlayPauseIcon(false), 500);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <View className="w-full flex-1">
      <View className="relative w-full flex-1 bg-projectBlack">
        {/* Video Player */}
        <View className="w-full flex-1 bg-projectBlack">
          {videoUrl ? (
            <CustomExpoVideoPlayer
              videoUrl={videoUrl}
              ref={videoRef}
              isPlaying={isPlaying}
              isMuted={isMuted}
              onStatusUpdate={onStatusUpdate}
              style={{ flex: 1, width: "100%" }}
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text>Loading...</Text>
            </View>
          )}
        </View>

        {/* Overlay Controls */}
        <View className="absolute h-full w-full p-5">
          {/* Continue Button */}
          <View className="w-ful lpx-6 mb-8">
            <TouchableOpacity
              className="flex-row items-center justify-center rounded-medium bg-primary_custom px-10 py-4"
              onPress={handleContinuePress}
            >
              <View className="flex-row items-center">
                <Text className="text-center font-sans-bold text-body text-projectWhite">
                  Continuar
                </Text>
                <Icon
                  name="chevron-right"
                  type="material"
                  size={24}
                  color="white"
                  style={{ marginLeft: 8 }}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Lecture Information */}
          <View className="justify-left w-full flex-col items-start">
            <View className="w-full flex-row items-end justify-between">
              <View className="flex-col">
                <Text className="text-base text-projectWhite opacity-80">
                  Nome do curso: {courseObject.title}
                </Text>
                <Text className="text-lg text-projectWhite">
                  {lectureObject.title}
                </Text>
              </View>
              <VideoActions
                isPlaying={isPlaying}
                isMuted={isMuted}
                onVolumeClick={toggleMute}
                onPlayClick={togglePlayPause}
                currentResolution={currentResolution}
                allResolutions={allResolutions}
                onResolutionChange={handleResolutionChange}
              />
            </View>

            <View className="h-3" />

            {/* Video Progress Bar */}
            <ReactSliderProgress
              elapsedMs={positionMillis}
              totalMs={durationMillis}
              videoRef={videoRef}
            />
          </View>
        </View>

        {/* Pressable Areas for Play/Pause */}
        <Pressable
          className="absolute top-[12%] bottom-[50%] right-0 left-0"
          onPress={togglePlayPause}
        />
        <Pressable
          className="absolute top-[24%] bottom-[22%] right-[20%] left-0"
          onPress={togglePlayPause}
        />

        {/* Play/Pause Icon */}
        {showPlayPauseIcon && (
          <View
            className="absolute top-0 left-0 right-0 bottom-0 flex-row items-center justify-center"
            pointerEvents="none"
          >
            <MaterialCommunityIcons
              name={isPlaying ? "pause" : "play"}
              size={50}
              color="white"
            />
          </View>
        )}
      </View>
    </View>
  );
};

VideoLectureScreen.propTypes = {
  lectureObject: PropTypes.object.isRequired,
  courseObject: PropTypes.object.isRequired,
  isLastSlide: PropTypes.bool.isRequired,
  onContinue: PropTypes.func.isRequired,
  handleStudyStreak: PropTypes.func.isRequired,
};

export default VideoLectureScreen;
