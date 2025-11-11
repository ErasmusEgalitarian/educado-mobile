import { useState, useEffect, useRef } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import Swiper from "react-native-swiper";
import { ProgressTopBar } from "@/screens/Lectures/ProgressTopBar";
import { Lecture } from "@/components/Lectures/Lecture";
import ExerciseScreen from "@/screens/Excercises/ExerciseScreen";
import { colors } from "@/theme/colors";
import { findIndexOfUncompletedComp, differenceInDays } from "@/services/utils";
import {
  Section,
  Course,
  SectionComponent,
  SectionComponentLecture,
  SectionComponentExercise,
  LectureType,
} from "@/types";
import {
  useCompleteComponent,
  useLoginStudent,
  useSectionComponents,
  useStudent,
  useUpdateStudyStreak,
} from "@/hooks/query";

interface ComponentSwipeScreenProps {
  route: {
    params: {
      section: Section;
      parsedCourse: Course;
      parsedComponentIndex?: number;
    };
  };
}

/**
 * This screen is displayed when the student is doing a component. It displays the component, which can be a lecture or
 * an exercise. When the student presses the continue-button, or swipes, the next component is displayed. The swiper is
 * disabled when the student is doing an exercise. The swiper starts at the first uncompleted component in the section.
 * The swiper is enabled when the student is doing a lecture. The screen has a progress bar at the top, which shows the
 * progress in the section. It also shows the points the student has earned in the course.
 *
 * @param route - The route object, which contains the section object and the course object.
 */
const ComponentSwipeScreen = ({ route }: ComponentSwipeScreenProps) => {
  const { section, parsedCourse, parsedComponentIndex } = route.params;

  const [currentLectureType, setCurrentLectureType] =
    useState<LectureType>("text");
  const [index, setIndex] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [sectionComponents, setSectionComponents] = useState<
    SectionComponent<SectionComponentLecture | SectionComponentExercise>[]
  >([]);
  const swiperRef = useRef<null | Swiper>(null);
  const [resetKey, setResetKey] = useState(0);

  const { data: loginStudent } = useLoginStudent();

  const studentId = loginStudent.userInfo.id;

  const studentQuery = useStudent(studentId);
  const student = studentQuery.data;

  const {
    data: fetchedSectionComponents = [],
    isLoading: areSectionComponentsLoading,
  } = useSectionComponents(section.sectionId);

  const completeComponentQuery = useCompleteComponent();
  const updateStudyStreakQuery = useUpdateStudyStreak();

  const studentLastStudyDate = student?.lastStudyDate ?? new Date();
  const isLoading = studentQuery.isLoading || areSectionComponentsLoading;

  const safeScrollBy = (offset: number, animated: true) => {
    swiperRef.current?.scrollBy(offset, animated);
  };

  /**
   * Handles student study streak update process. Checks the difference in days between lastStudyDate and today. If the
   * difference is greater than 0, it updates `studyStreak` and `lastStudyDate` both in the database, local storage and
   * this local state.
   */
  const handleStudyStreak = async () => {
    if (!student) {
      return;
    }

    const today = new Date();
    const dayDifference = differenceInDays(studentLastStudyDate, today);

    if (dayDifference === 0) {
      return;
    }

    updateStudyStreakQuery.mutate({
      studentId: student.id,
    });

    await studentQuery.refetch();
  };

  const handleExerciseContinue = (isCorrect: boolean) => {
    if (!isCorrect) {
      // Update the section component list to move the incorrect exercise to the end
      const currentComp = sectionComponents[index];
      const updatedCombinedLecturesAndExercises = [
        ...sectionComponents.slice(0, index), // Elements before the current index
        ...sectionComponents.slice(index + 1), // Elements after the current index
        currentComp, // Add the current component to the end
      ];

      setSectionComponents(updatedCombinedLecturesAndExercises);

      // Force re-render by updating the resetKey
      setResetKey((prevKey) => prevKey + 1);
    } else {
      safeScrollBy(1, true);
      setScrollEnabled(true);
    }

    // True if this is the last lecture/exercise
    return index === sectionComponents.length - 1;
  };

  const handleIndexChange = async (index: number) => {
    if (!student) {
      return;
    }

    await handleStudyStreak();

    const currentSlide = sectionComponents[index];

    if (currentSlide.type === "exercise") {
      setScrollEnabled(false);
    } else {
      const currentLectureType = currentSlide.lectureType ?? "text";
      setCurrentLectureType(currentLectureType);
      setScrollEnabled(true);
    }

    if (index > 0) {
      const lastSlide = sectionComponents[index - 1];

      await completeComponentQuery.mutateAsync({
        student,
        component: lastSlide.component,
        isComplete: true,
      });
    }

    setIndex(index);
  };

  useEffect(() => {
    if (fetchedSectionComponents.length === 0) {
      return;
    }

    setSectionComponents(fetchedSectionComponents);
  }, [fetchedSectionComponents]);

  useEffect(() => {
    if (isLoading || !student || sectionComponents.length === 0) {
      return;
    }

    let initialIndex =
      parsedComponentIndex ??
      findIndexOfUncompletedComp(
        student,
        parsedCourse.courseId,
        section.sectionId,
      );

    if (initialIndex === -1) {
      initialIndex = 0;
    }

    const firstSectionComponent = sectionComponents[initialIndex];

    if (firstSectionComponent.type === "exercise") {
      setScrollEnabled(false);
    }

    setCurrentLectureType(firstSectionComponent.lectureType ?? "text");
    setIndex(initialIndex);
  }, [
    isLoading,
    parsedComponentIndex,
    parsedCourse.courseId,
    section.sectionId,
    sectionComponents,
    student,
  ]);

  if (isLoading) {
    return (
      <View className="h-screen flex-col items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary_custom} />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      {sectionComponents.length > 0 && (
        <View className="absolute top-0 z-10 w-full">
          <ProgressTopBar
            courseObject={parsedCourse}
            lectureType={currentLectureType}
            components={sectionComponents}
            currentIndex={index}
          />
        </View>
      )}

      {sectionComponents.length > 0 && (
        <Swiper
          key={resetKey}
          ref={swiperRef}
          index={index}
          onIndexChanged={void handleIndexChange}
          loop={false}
          showsPagination={false}
          scrollEnabled={scrollEnabled}
        >
          {sectionComponents.map((component, index) =>
            component.type === "lecture" ? (
              <Lecture
                key={component.component.id || index}
                lecture={component.component as SectionComponentLecture}
                course={parsedCourse}
                isLastSlide={index === sectionComponents.length - 1}
                onContinue={() => {
                  safeScrollBy(1, true);
                }}
                handleStudyStreak={() => {
                  void handleStudyStreak();
                }}
              />
            ) : (
              <ExerciseScreen
                key={component.component.id || index}
                componentList={
                  sectionComponents as unknown as SectionComponentExercise[]
                }
                exerciseObject={component.component as SectionComponentExercise}
                sectionObject={section}
                courseObject={parsedCourse}
                onContinue={(isCorrect: boolean) =>
                  handleExerciseContinue(isCorrect)
                }
                handleStudyStreak={async () => {
                  await handleStudyStreak();
                }}
              />
            ),
          )}
        </Swiper>
      )}
    </View>
  );
};

export default ComponentSwipeScreen;
