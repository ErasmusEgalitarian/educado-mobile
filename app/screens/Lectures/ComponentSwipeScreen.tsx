import { useState, useEffect, useRef } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import PagerView from "react-native-pager-view";

import ProgressTopBar from "@/app/screens/Lectures/ProgressTopBar";
import { Lecture } from "@/components/Lectures/Lecture";
import ExerciseScreen from "@/app/screens/Excercises/ExerciseScreen";
import { colors } from "@/theme/colors";
import { findIndexOfUncompletedComp, differenceInDays } from "@/services/utils";
import {
  Section,
  Course,
  SectionComponent,
  SectionComponentLecture,
  SectionComponentExercise,
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
 * Screen that displays a single section component (lecture or exercise) and
 * lets the student navigate between components using react-native-pager-view.
 * Swiping is enabled for lectures and disabled for exercises. The view starts
 * at the first uncompleted component.
 * A top progress bar shows section progress and course points. "Continue"
 * actions use programmatic navigation and incorrect exercise answers are moved
 * to the end of the queue.
 *
 * @param route.params.section - Section object.
 * @param route.params.parsedCourse - Course object.
 * @param route.params.parsedComponentIndex - Optional initial component index.
 */
const ComponentSwipeScreen = ({ route }: ComponentSwipeScreenProps) => {
  const { section, parsedCourse, parsedComponentIndex } = route.params;

  const [currentLectureType, setCurrentLectureType] = useState("text");
  const [index, setIndex] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [sectionComponents, setSectionComponents] = useState<
    SectionComponent<SectionComponentLecture | SectionComponentExercise>[]
  >([]);
  const pagerRef = useRef<null | PagerView>(null);
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
    const target = Math.max(
      0,
      Math.min(index + offset, sectionComponents.length - 1),
    );

    if (animated) {
      pagerRef.current?.setPage(target);
    } else {
      pagerRef.current?.setPageWithoutAnimation(target);
    }
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
      const currentLectureType =
        currentSlide.lectureType === "video" ? "video" : "text";
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

    pagerRef.current?.setPageWithoutAnimation(initialIndex);
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
        <PagerView
          key={resetKey}
          ref={pagerRef}
          style={{ flex: 1 }}
          initialPage={index}
          onPageSelected={(e) => {
            void handleIndexChange(e.nativeEvent.position);
          }}
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
                handleStudyStreak={() => {
                  void handleStudyStreak();
                }}
              />
            ),
          )}
        </PagerView>
      )}
    </View>
  );
};

export default ComponentSwipeScreen;
