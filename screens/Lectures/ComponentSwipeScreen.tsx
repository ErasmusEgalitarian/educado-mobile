import { useState, useEffect, useRef } from "react";
import { View, ActivityIndicator } from "react-native";
import Swiper from "react-native-swiper";
import PropTypes from "prop-types";
import Text from "../../components/General/Text";
import ProgressTopBar from "./ProgressTopBar";
import LectureScreen from "./LectureScreen";
import ExerciseScreen from "../Excercises/ExerciseScreen";
import tailwindConfig from "../../tailwind.config.js";
import {
  completeComponent,
  findIndexOfUncompletedComp,
  differenceInDays,
} from "../../services/utils";
import {
  getComponentList,
  getStudentInfo,
  updateLocalStudyStreak,
} from "../../services/storage-service";
import { updateStudyStreak } from "../../api/user-api";

const LectureType = {
  TEXT: "text",
  VIDEO: "video",
};

const ComponentType = {
  LECTURE: "lecture",
  EXERCISE: "exercise",
};

/**
 * Description: 	This screen is displayed when the student is doing a component.
 * 				It displays the component, which can be a lecture or an exercise.
 * 				When the student presses the continue button, or swipes, the next component is displayed.
 * 				The swiper is disabled when the student is doing an exercise.
 * 				The swiper starts at the first uncompleted component in the section.
 * 				The swiper is enabled when the student is doing a lecture.
 * 				The screen has a progress bar at the top, which shows the progress in the section.
 * 				It also shows the points the student has earned in the course.
 * Dependencies:	That there exists a course object and a section object, which has components.
 * Props:			- route: The route object, which contains the section object and the course object
 */
const ComponentSwipeScreen = ({ route }) => {
  const { section, parsedCourse, parsedComponentIndex } = route.params;
  const [loading, setLoading] = useState(true);
  const [currentLectureType, setCurrentLectureType] = useState(
    LectureType.TEXT,
  );
  const [index, setIndex] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [combinedLecturesAndExercises, setCombinedLecturesAndExercises] =
    useState([]);
  const swiperRef = useRef(null);
  const [resetKey, setResetKey] = useState(0);
  const [studentId, setStudentId] = useState("");
  const [lastStudyDate, setLastStudyDate] = useState(
    "1970-01-01T00:00:00.000Z",
  );

  /**
   * Handles student study streak update process.
   * Checks difference in days between lastStudyDate and today.
   * If difference is greater than 0 it updates: studyStreak and lastStudyDate
   * both in database, local storage and this local state.
   */
  async function handleStudyStreak() {
    try {
      const today = new Date();
      const dayDifference = differenceInDays(new Date(lastStudyDate), today);

      // Update study streak if it has not already been updated today
      if (dayDifference > 0) {
        const statusCode = await updateStudyStreak(studentId); // Database

        if (statusCode !== 200) throw new Error();

        updateLocalStudyStreak(today); // Local storage
        setLastStudyDate(today);
      }
    } catch (error) {
      console.error("Error handling study streak: " + error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentInfo = await getStudentInfo();
        setStudentId(studentInfo._id);
        setLastStudyDate(studentInfo.lastStudyDate);

        let initialIndex =
          parsedComponentIndex ??
          findIndexOfUncompletedComp(
            studentInfo,
            parsedCourse.courseId,
            section.sectionId,
          );

        if (initialIndex === -1) {
          initialIndex = 0;
        }

        let compList = await getComponentList(section.sectionId);

        // Remove the reverse if not needed
        // compList = compList.reverse();

        if (compList[initialIndex].type === ComponentType.EXERCISE) {
          setScrollEnabled(false);
        }

        setCombinedLecturesAndExercises(compList);
        setCurrentLectureType(
          compList[initialIndex]?.lectureType === LectureType.VIDEO
            ? LectureType.VIDEO
            : LectureType.TEXT,
        );
        setIndex(initialIndex);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching components:", error);
        setLoading(true);
      }
    };

    fetchData();
  }, [section, parsedCourse]);

  // Handler for continuing from a lecture
  const handleLectureContinue = () => {
    swiperRef.current.scrollBy(1, true);
  };

  const handleExerciseContinue = (isCorrect) => {
    if (!isCorrect) {
      // Update the section component list to move the incorrect exercise to the end
      const currentComp = combinedLecturesAndExercises[index];
      const updatedCombinedLecturesAndExercises = [
        ...combinedLecturesAndExercises.slice(0, index), // Elements before the current index
        ...combinedLecturesAndExercises.slice(index + 1), // Elements after the current index
        currentComp, // Add the current component to the end
      ];
      setCombinedLecturesAndExercises(updatedCombinedLecturesAndExercises);

      // Force re-render by updating the resetKey
      setResetKey((prevKey) => prevKey + 1);
    } else {
      swiperRef.current.scrollBy(1, true);
      setScrollEnabled(true);
    }

    return index === combinedLecturesAndExercises.length - 1; // True if this is the last lecture/exercise
  };

  const handleIndexChange = async (_index) => {
    handleStudyStreak();
    const currentSlide = combinedLecturesAndExercises[_index];

    if (currentSlide.type === ComponentType.EXERCISE) {
      setScrollEnabled(false);
    } else {
      const currentLectureType =
        currentSlide?.lectureType === LectureType.VIDEO
          ? LectureType.VIDEO
          : LectureType.TEXT;
      setCurrentLectureType(currentLectureType);
      setScrollEnabled(true);
    }

    if (_index > 0) {
      const lastSlide = combinedLecturesAndExercises[_index - 1];
      try {
        await completeComponent(
          lastSlide.component,
          parsedCourse.courseId,
          true,
        );
      } catch (error) {
        console.error("Error completing component:", error);
        // Optionally, show an error message to the user
      }
    }
    setIndex(_index);
  };

  if (loading || !section || !parsedCourse || !combinedLecturesAndExercises) {
    return (
      <View className="h-screen flex-col items-center justify-center">
        <ActivityIndicator
          size="large"
          color={tailwindConfig.theme.colors.primary_custom}
        />
        <Text>Loading...</Text>
      </View>
    );
  } else {
    return (
      <View className="flex-1">
        {combinedLecturesAndExercises && (
          <View className="absolute top-0 z-10 w-full">
            <ProgressTopBar
              courseObject={parsedCourse}
              lectureType={currentLectureType}
              components={combinedLecturesAndExercises}
              currentIndex={index}
            />
          </View>
        )}

        {combinedLecturesAndExercises.length > 0 &&
          parsedCourse &&
          index !== null && (
            <Swiper
              key={resetKey} // Add key to force re-render when resetKey changes
              ref={swiperRef}
              index={index}
              onIndexChanged={handleIndexChange}
              loop={false}
              showsPagination={false}
              scrollEnabled={scrollEnabled}
            >
              {combinedLecturesAndExercises.map((comp, _index) =>
                comp.type === ComponentType.LECTURE ? (
                  <LectureScreen
                    key={comp.component._id || _index} // Use a unique key if available
                    currentIndex={_index}
                    indexCount={combinedLecturesAndExercises.length}
                    lectureObject={comp.component}
                    courseObject={parsedCourse}
                    isLastSlide={
                      _index === combinedLecturesAndExercises.length - 1
                    }
                    onContinue={handleLectureContinue} // Pass handleLectureContinue here
                    handleStudyStreak={handleStudyStreak}
                  />
                ) : (
                  <ExerciseScreen
                    key={comp.component._id || _index} // Use a unique key if available
                    componentList={combinedLecturesAndExercises}
                    exerciseObject={comp.component}
                    sectionObject={section}
                    courseObject={parsedCourse}
                    onContinue={(isCorrect) =>
                      handleExerciseContinue(isCorrect)
                    }
                    handleStudyStreak={handleStudyStreak}
                  />
                ),
              )}
            </Swiper>
          )}
      </View>
    );
  }
};

ComponentSwipeScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      section: PropTypes.object.isRequired,
      parsedCourse: PropTypes.object.isRequired,
      parsedComponentIndex: PropTypes.number,
    }).isRequired,
  }).isRequired,
};

export default ComponentSwipeScreen;
