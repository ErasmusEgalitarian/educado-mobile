import { forwardRef } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import { colors } from "@/theme/colors";

interface CustomExpoVideoPlayerProps {
  onStatusUpdate: (status: AVPlaybackStatus) => void;
  videoUrl: string;
  isMuted?: boolean;
  isPlaying?: boolean;
}

const CustomExpoVideoPlayer = forwardRef(
  (
    {
      onStatusUpdate,
      videoUrl,
      isMuted = false,
      isPlaying = true,
    }: CustomExpoVideoPlayerProps,
    ref,
  ) => {
    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: colors.projectBlack,
      },
      video: {
        alignSelf: "center",
        width: screenWidth,
        height: screenHeight + screenHeight / 10,
      },
    });

    return (
      <View style={styles.container}>
        <Video
          ref={ref}
          useNativeControls={false}
          source={{
            uri: videoUrl,
          }}
          volume={1.0}
          rate={1.0}
          isMuted={isMuted}
          resizeMode={ResizeMode.COVER}
          shouldPlay={isPlaying}
          isLooping={true}
          onPlaybackStatusUpdate={onStatusUpdate}
          style={styles.video}
        />
      </View>
    );
  },
);

CustomExpoVideoPlayer.displayName = "CustomExpoVideoPlayer";

export default CustomExpoVideoPlayer;
