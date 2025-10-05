import { useEffect, useState } from "react";
import Animated from "react-native-reanimated";
import AnimatedNumbers from "../Gamification/AnimatedNumber";
import { getStudentInfo } from "../../services/storage-service";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import tailwindConfig from "../../tailwind.config.js";
import PropTypes from "prop-types";
import {
  getPointsFromExerciseReceiver,
  getPointsFromExerciseUnsubscribe,
} from "../events/receiver-events";

/* 
Description:	This component displays the points the student has earned in the course.
				The points are retrieved from the student model (in the field courses.totalPoints) in the database,
				which are updated when completing an exercise.
				When getting points, an animation is triggered by an event from ExerciseScreen.
Denpendencies: 	The student must be in a exercise or lecture.
Props: 			courseId - The id of the course the student is in.
*/

const CoursePoints = (courseId) => {
  const [coursePoints, setCoursePoints] = useState(0);
  const [scale, setScale] = useState(1);

  const getCompletedCourses = async () => {
    const studentInfo = await getStudentInfo();
    return studentInfo.courses;
  };

  const updateCoursePoints = (newPoints) => {
    if (newPoints === 0) return;

    let isFirstIteration = true;
    let finalValue;
    let counter = 0;
    setScale(1.5);
    const interval = setInterval(() => {
      counter++;
      setCoursePoints((prevNumber) => {
        if (isFirstIteration) {
          finalValue = prevNumber + newPoints;
          isFirstIteration = false;
        }
        const nextNumber = prevNumber + 1;
        if (nextNumber >= finalValue) {
          clearInterval(interval);
          setTimeout(() => {
            setScale(1);
          }, 75 * counter);
          return finalValue;
        }
        return nextNumber;
      });
    }, 50);
  };

  const fetchCourseAndPoints = async () => {
    try {
      const completedCourses = await getCompletedCourses();
      const currentCourse = completedCourses.find(
        (course) => course.courseId === courseId.courseId,
      );

      if (currentCourse && completedCourses) {
        setCoursePoints(currentCourse.totalPoints);
      } else {
        setCoursePoints(0);
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  };

  useEffect(() => {
    fetchCourseAndPoints();

    getPointsFromExerciseReceiver(updateCoursePoints);
    return () => {
      getPointsFromExerciseUnsubscribe();
    };
  }, []);

  return (
    <Animated.View
      className="flex flex-row items-center justify-around pr-2"
      style={[
        {
          transform: [
            {
              scale: scale,
            },
          ],
        },
      ]}
    >
      <AnimatedNumbers
        animateToNumber={coursePoints}
        animationDuration={500}
        fontStyle={"font-sans-bold text-center"}
      />
      <MaterialCommunityIcons
        name="crown-circle"
        size={20}
        color={tailwindConfig.theme.colors.yellow}
      />
    </Animated.View>
  );
};

CoursePoints.propTypes = {
  courseId: PropTypes.string,
};

export default CoursePoints;
