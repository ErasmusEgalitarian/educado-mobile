import { useState, useEffect, useRef } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import Swiper from "react-native-swiper";
import { useNavigation } from "@react-navigation/native";
import { ProgressTopBar } from "@/screens/Lectures/ProgressTopBar";
import ExerciseScreen from "@/components/Activities/Exercise";
import { colors } from "@/theme/colors";
import {
  findIndexOfUncompletedComp,
  differenceInDays,
  handleLastComponent,
} from "@/services/utils";
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
  const [currentLectureType, setCurrentLectureType] =
    useState<LectureType>("text");
  const [index, setIndex] = useState(0);
  const [initialIndex, setInitialIndex] = useState(0);
  const initialIndexSetRef = useRef(false);
  const [resetKey, setResetKey] = useState(0);
  const [sectionComponents, setSectionComponents] = useState<
    SectionComponent<SectionComponentLecture | SectionComponentExercise>[]
  >([]);
  const swiperRef = useRef<null | Swiper>(null);
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
  const navigation = useNavigation();

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

  const handleContinue = async (isCorrect: boolean) => {
    const currentComp = sectionComponents[index];
    const isLastSlide = index >= sectionComponents.length - 1;
    if (!student) {
      return;
    }

    // If the activity is not correctly answered
    if (!isCorrect) {
      // Move it to the end
      setSectionComponents((prev) => {
        const comp = prev[index];
        return [...prev.slice(0, index), ...prev.slice(index + 1), comp];
      });

      // Re-render if it's last slide
      if (isLastSlide) {
        setInitialIndex(index);
        setResetKey((prev) => prev + 1);
      }
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

    // Update study streak
    await handleStudyStreak();

    // Complete lesson if it's last slide
    if (isLastSlide) {
      await handleLastComponent(currentComp, parsedCourse, navigation);
      return;
    }

    // Go to the next slide
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
            currentIndex={index}
          />
        </View>
      )}

      {sectionComponents.length > 0 && (
        <PagerView
          key={resetKey}
          ref={swiperRef}
          loop={false}
          showsPagination={false}
          scrollEnabled={false}
          index={initialIndex}
          onIndexChanged={setIndex}
        >
          {sectionComponents.map((component, index) =>
            component.type === "lecture" ? (
              (component.component as SectionComponentLecture).contentType ===
              "video" ? (
                <VideoLecture
                  key={component.component.id || index}
                  lecture={component.component as SectionComponentLecture}
                  course={parsedCourse}
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
        </PagerView>
      )}
    </View>
  );
};

export default ComponentSwipeScreen;
