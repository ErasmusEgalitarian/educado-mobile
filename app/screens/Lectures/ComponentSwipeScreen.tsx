import { useState, useEffect, useRef } from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import PagerView from "react-native-pager-view";
import { useNavigation } from "@react-navigation/native";
import { ProgressTopBar } from "@/app/screens/Lectures/ProgressTopBar";
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

const styles = StyleSheet.create({
  pager: {
    flex: 1,
  },
});

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
  const [index, setIndex] = useState(0);
  const initialIndexSetRef = useRef(false);
  const [resetKey, setResetKey] = useState(0);
  const [sectionComponents, setSectionComponents] = useState<
    SectionComponent<SectionComponentLecture | SectionComponentExercise>[]
  >([]);
  const pagerRef = useRef<PagerView>(null);
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

      // Re-render the page
      setResetKey((prev) => prev + 1);
      requestAnimationFrame(() => {
        pagerRef.current?.setPage(index);
      });
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

    // Otherwise go to the next slide
    pagerRef.current?.setPage(index + 1);
    setIndex(index + 1);
  };

  useEffect(() => {
    if (
      !student ||
      initialIndexSetRef.current ||
      fetchedSectionComponents.length === 0
    ) {
      return;
    }

    // Set the componenets
    setSectionComponents(fetchedSectionComponents);

    // Set the index
    const initialIndex =
      parsedComponentIndex ??
      findIndexOfUncompletedComp(
        student,
        parsedCourse.courseId,
        section.sectionId,
      );
    setIndex(initialIndex);

    // Lock the effect (runs only once)
    initialIndexSetRef.current = true;
  }, [
    fetchedSectionComponents,
    parsedComponentIndex,
    parsedCourse.courseId,
    section.sectionId,
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
            components={sectionComponents}
            currentIndex={index}
          />
        </View>
      )}

      {sectionComponents.length > 0 && (
        <PagerView
          key={resetKey}
          ref={pagerRef}
          style={styles.pager}
          initialPage={index}
          scrollEnabled={false}
        >
          {sectionComponents.map((component, idx) => {
            const key = component.component.id || idx;

            if (component.type === "lecture") {
              const lecture = component.component as SectionComponentLecture;
              return lecture.contentType === "video" ? (
                <VideoLecture
                  key={key}
                  lecture={lecture}
                  course={parsedCourse}
                  isActive={index === idx}
                  onContinue={() => handleContinue(true)}
                />
              ) : (
                <TextImageLectureScreen
                  key={key}
                  componentList={sectionComponents}
                  lectureObject={lecture}
                  courseObject={parsedCourse}
                  onContinue={() => handleContinue(true)}
                />
              );
            }

            const exercise = component.component as SectionComponentExercise;
            return (
              <ExerciseScreen
                key={key}
                componentList={sectionComponents}
                exerciseObject={exercise}
                sectionObject={section}
                courseObject={parsedCourse}
                onContinue={handleContinue}
              />
            );
          })}
        </PagerView>
      )}
    </View>
  );
};

export default ComponentSwipeScreen;
