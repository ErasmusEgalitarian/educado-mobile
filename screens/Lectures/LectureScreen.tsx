import { View } from "react-native";
import { VideoLecture } from "@/components/Lectures/VideoLecture";
import TextImageLectureScreen from "@/screens/Lectures/TextImageLectureScreen";
import { Lecture } from "@/types/lecture";
import { Course } from "@/types/course";

interface LectureScreenProps {
  lectureObject: Lecture;
  courseObject: Course;
  isLastSlide: boolean;
  onContinue: () => void;
  handleStudyStreak: () => Promise<void>;
}

/**
 * TODO: Move to `components/Lectures` and rename to `Lecture`.
 *
 * @param lectureObject - The lecture object containing the lecture data.
 * @param courseObject - The course object containing the course data.
 * @param isLastSlide - A boolean indicating whether this is the last slide of the lecture.
 * @param onContinue - A function to be called when the continue button is pressed.
 * @param handleStudyStreak - A function to handle the study streak.
 */
export const LectureScreen = ({
  lectureObject,
  courseObject,
  isLastSlide,
  onContinue,
  handleStudyStreak,
}: LectureScreenProps) => {
  return (
    <View className="flex-1">
      <View className="flex-1 flex-col">
        {lectureObject.contentType === "video" ? (
          <VideoLecture
            lecture={lectureObject}
            course={courseObject}
            isLastSlide={isLastSlide}
            onContinue={onContinue}
            handleStudyStreak={() => void handleStudyStreak}
          />
        ) : (
          <TextImageLectureScreen
            lectureObject={lectureObject}
            courseObject={courseObject}
            isLastSlide={isLastSlide}
            onContinue={onContinue}
            handleStudyStreak={handleStudyStreak}
          />
        )}
      </View>
    </View>
  );
};

// TODO: For legacy import in ComponentSwipeScreen. Remove when ComponentSwipeScreen is updated.
export default LectureScreen;
