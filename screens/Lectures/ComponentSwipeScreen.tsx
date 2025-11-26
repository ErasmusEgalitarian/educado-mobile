import { useState, useEffect, useRef } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import Swiper from "react-native-swiper";
import { ProgressTopBar } from "@/screens/Lectures/ProgressTopBar";
import ExerciseScreen from "@/components/Activities/Exercise";
import { colors } from "@/theme/colors";
import { findIndexOfUncompletedComp, differenceInDays } from "@/services/utils";
import { VideoLecture } from "@/components/Activities/Video";
import TextImageLectureScreen from "@/components/Activities/TextImage";
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
  const [initialIndex, setInitialIndex] = useState(0);
  const initialIndexSetRef = useRef(false);
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

  const handleStudyStreak = async () => {
    const today = new Date();
    const dayDifference = differenceInDays(studentLastStudyDate, today);
    if (!student || dayDifference === 0) {
      return;
    }

    // Update the database
    updateStudyStreakQuery.mutate({
      studentId: student.id,
    });
    await studentQuery.refetch();
  };

  // TODO: missing logic for when lesson (all components) is completed

  const handleContinue = async (isCorrect: boolean) => {
    const currentComp = sectionComponents[index];
    if (!student) {
      return;
    }
    // TODO: not sure if this logic works 100%
    // If the activity is not correctly answered
    if (!isCorrect) {
      // Update the section component list to move the incorrect activity to the end
      const updatedCombinedLecturesAndExercises = [
        ...sectionComponents.slice(0, index), // Elements before the current index
        ...sectionComponents.slice(index + 1), // Elements after the current index
        currentComp, // Add the current component to the end
      ];
      setSectionComponents(updatedCombinedLecturesAndExercises);
      // Force re-render by updating the resetKey
      setResetKey((prevKey) => prevKey + 1);
      return;
    }

    // Update the database
    try {
      await completeComponentQuery.mutateAsync({
        student,
        component: currentComp.component,
        isComplete: true,
      });
    } catch (error) {
      console.error("Unable to complete component: ", error);
    }

    // Update streak, index, and move to next component
    await handleStudyStreak();
    setIndex(index + 1);
    swiperRef.current?.scrollBy(1, true);
  };

  // Set the components
  useEffect(() => {
    if (fetchedSectionComponents.length === 0) {
      return;
    }

    setSectionComponents(fetchedSectionComponents);
  }, [fetchedSectionComponents]);

  // Set the page index
  useEffect(() => {
    // Run only once and only when all data is gathered
    if (
      initialIndexSetRef.current ||
      isLoading ||
      !student ||
      sectionComponents.length === 0
    ) {
      return;
    }

    // Get the initial index
    const initialIndex =
      parsedComponentIndex ??
      findIndexOfUncompletedComp(
        student,
        parsedCourse.courseId,
        section.sectionId,
      );

    // Sanity check
    if (initialIndex < 0) {
      console.warn("Initial index less than zero: ", initialIndex);
      setIndex(0);
      initialIndexSetRef.current = true;
      return;
    }

    // Set the initial index, component and type
    const firstSectionComponent = sectionComponents[initialIndex];
    setCurrentLectureType(firstSectionComponent.lectureType ?? "text");
    setInitialIndex(initialIndex);
    setIndex(initialIndex);

    initialIndexSetRef.current = true;
  }, [
    isLoading,
    student,
    sectionComponents.length,
    sectionComponents,
    parsedComponentIndex,
    parsedCourse.courseId,
    section.sectionId,
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
          loop={false}
          showsPagination={false}
          scrollEnabled={false}
          index={initialIndex}
        >
          {sectionComponents.map((component, index) =>
            component.type === "lecture" ? (
              (component.component as SectionComponentLecture).contentType ===
              "video" ? (
                <VideoLecture
                  key={component.component.id || index}
                  lecture={component.component as SectionComponentLecture}
                  course={parsedCourse}
                  isLastSlide={index === sectionComponents.length - 1}
                  onContinue={async () => {
                    await handleContinue(true);
                  }}
                />
              ) : (
                <TextImageLectureScreen
                  key={component.component.id || index}
                  componentList={sectionComponents}
                  lectureObject={component.component as SectionComponentLecture}
                  courseObject={parsedCourse}
                  isLastSlide={index === sectionComponents.length - 1}
                  onContinue={async () => {
                    await handleContinue(true);
                  }}
                />
              )
            ) : (
              <ExerciseScreen
                key={component.component.id || index}
                componentList={sectionComponents}
                exerciseObject={component.component as SectionComponentExercise}
                sectionObject={section}
                courseObject={parsedCourse}
                onContinue={async (isCorrect: boolean) => {
                  await handleContinue(isCorrect);
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
