import { useState } from "react";
import { View } from "react-native";
import PropTypes from "prop-types";

import TextIconButton from "./TextIconButton";

export default function VideoChangeResolution({
  currentResolution = "360",
  onResolutionChange,
  allResolutions = ["360", "480", "720", "1080"],
}) {
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const [expanded, setExpanded] = useState(false);

  const [mainIconButtonWidth, setMainIconButtonWidth] = useState(45);

  return (
    <View className="relative">
      {expanded && (
        <View
          className={"absolute z-50 flex-row"}
          //had to use style prop because tailwind was not working
          style={{ right: mainIconButtonWidth }}
        >
          {allResolutions.map((resolution, index) => (
            <React.Fragment key={index}>
              <TextIconButton
                pressed={currentResolution === resolution}
                text={resolution}
                onClick={() => onResolutionChange(resolution)}
              />
              <View className="w-[1.5vh]" />
            </React.Fragment>
          ))}
        </View>
      )}
      <View
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          setMainIconButtonWidth(width);
        }}
      >
        <TextIconButton
          pressed={expanded}
          text={currentResolution}
          onClick={toggleExpanded}
        />
      </View>
    </View>
  );
}

VideoChangeResolution.propTypes = {
  allResolutions: PropTypes.array,
  currentResolution: PropTypes.string,
  onResolutionChange: PropTypes.func,
};
