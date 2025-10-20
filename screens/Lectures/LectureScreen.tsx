import { useState, useEffect } from "react";
import { View } from "react-native";
import VideoLectureScreen from "@/screens/Lectures/VideoLectureScreen";
import TextImageLectureScreen from "@/screens/Lectures/TextImageLectureScreen";
import { Lecture } from "@/types/lecture";
import { Course } from "@/types/course";

interface Props {
  lectureObject: Lecture;
  courseObject: Course;
  isLastSlide: boolean;
  onContinue: () => void;
  handleStudyStreak: () => Promise<void>;
}

const LectureScreen = ({
  lectureObject,
  courseObject,
  isLastSlide,
  onContinue,
  handleStudyStreak,
}: Props) => {
  const [course, setCourse] = useState<Course>(courseObject);
  const [lecture, setLecture] = useState<Lecture>(lectureObject);

  useEffect(() => {
    setLecture(lectureObject);
    setCourse(courseObject);
  }, [lectureObject, courseObject]);

  return (
    <View className="flex-1">
      <View className="flex-1 flex-col">
        {lecture.contentType === "video" ? (
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
    </View>
  );
};

export default LectureScreen;
