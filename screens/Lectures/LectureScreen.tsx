import { useState, useEffect } from "react";
import { View } from "react-native";
import VideoLectureScreen from "./VideoLectureScreen";
import TextImageLectureScreen from "./TextImageLectureScreen";
import PropTypes from "prop-types";
import Text from "../../components/General/Text";

const LectureScreen = ({
  lectureObject,
  courseObject,
  isLastSlide,
  onContinue,
  handleStudyStreak,
}) => {
  const [course, setCourse] = useState(courseObject);
  const [lecture, setLecture] = useState(lectureObject);

  useEffect(() => {
    setLecture(lectureObject);
    setCourse(courseObject);
  }, [lectureObject, courseObject]);

  return (
    <View className="flex-1 bg-projectWhite">
      {lecture && course ? (
        <View className="flex-1 flex-col">
          {lecture.video ? (
            <VideoLectureScreen
              lectureObject={lecture}
              courseObject={course}
              isLastSlide={isLastSlide}
              onContinue={onContinue}
              handleStudyStreak={handleStudyStreak}
            />
          ) : (
            <TextImageLectureScreen
              lectureObject={lecture}
              courseObject={course}
              isLastSlide={isLastSlide}
              onContinue={onContinue}
              handleStudyStreak={handleStudyStreak}
            />
          )}
        </View>
      ) : (
        <View className="h-full w-full items-center justify-center align-middle">
          <Text className="ml-[10] text-[25px] font-bold">Loading...</Text>
        </View>
      )}
    </View>
  );
};

LectureScreen.propTypes = {
  lectureObject: PropTypes.object.isRequired,
  courseObject: PropTypes.object.isRequired,
  isLastSlide: PropTypes.bool.isRequired,
  onContinue: PropTypes.func.isRequired,
  handleStudyStreak: PropTypes.func.isRequired,
};

export default LectureScreen;
