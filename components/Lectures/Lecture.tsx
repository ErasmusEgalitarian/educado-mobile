import { View } from "react-native";
import { VideoLecture } from "@/components/Lectures/VideoLecture";
import TextImageLectureScreen from "@/app/screens/Lectures/TextImageLectureScreen";
import { Course, SectionComponentLecture } from "@/types";

interface LectureScreenProps {
  lecture: SectionComponentLecture;
  course: Course;
  isLastSlide: boolean;
  onContinue: () => void;
  handleStudyStreak: () => void;
}

/**
 * @param lecture - The lecture object containing the lecture data.
 * @param course - The course object containing the course data.
 * @param isLastSlide - A boolean indicating whether this is the last slide of the lecture.
 * @param onContinue - A function to be called when the continue-button is pressed.
 * @param handleStudyStreak - A function to handle the study streak.
 */
export const Lecture = ({
  lecture,
  course,
  isLastSlide,
  onContinue,
  handleStudyStreak,
}: LectureScreenProps) => {
  return (
    <View className="flex-1">
      <View className="flex-1 flex-col">
        {lecture.contentType === "video" ? (
          <VideoLecture
            lecture={lecture}
            course={course}
            isLastSlide={isLastSlide}
            onContinue={onContinue}
            handleStudyStreak={() => void handleStudyStreak}
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
