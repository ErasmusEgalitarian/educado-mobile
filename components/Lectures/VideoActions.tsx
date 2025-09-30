import { useState } from "react";
import { View } from "react-native";
import IconButton from "./IconButton";
import PropTypes from "prop-types";
import VideoChangeResolution from "./VideoChangeResolution";

export default function VideoActions({
  currentResolution,
  allResolutions,
  onResolutionChange,
  isPlaying,
  isMuted,
  onPlayClick,
  onVolumeClick,
}) {
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const [expanded, setExpanded] = useState(false);

  return (
    <View className="">
      {expanded && (
        <View className="flex-col">
          <VideoChangeResolution
            currentResolution={currentResolution}
            allResolutions={allResolutions}
            onResolutionChange={onResolutionChange}
          />
          <View className="h-[1.5vh]" />
          <IconButton
            icon={isMuted ? "volume-mute" : "volume-high"}
            pressed={isMuted}
            onClick={onVolumeClick}
          />
          <View className="h-[1.5vh]" />
          <IconButton
            icon={isPlaying ? "pause" : "play"}
            pressed={isPlaying}
            onClick={onPlayClick}
          />
        </View>
      )}
      <View className="h-[1.5vh]" />
      <IconButton
        icon="dots-horizontal"
        pressed={expanded}
        onClick={toggleExpanded}
      />
    </View>
  );
}

VideoActions.propTypes = {
  allResolutions: PropTypes.array,
  currentResolution: PropTypes.string,
  onResolutionChange: PropTypes.func,
  isPlaying: PropTypes.bool,
  isMuted: PropTypes.bool,
  onPlayClick: PropTypes.func,
  onVolumeClick: PropTypes.func,
};
