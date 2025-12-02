// 1. React & hooks
import { useEffect, useState } from "react";

// 2. React Native core
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// 3. Third-party libraries
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

// 4. Local components
import { BaseScreen } from "@/components/General/BaseScreen";
import { CourseInfoCard } from "@/components/Courses/CourseInfoCard";
import { StartCourseButton } from "@/components/Courses/StartCourseButton";
import LoadingScreen from "@/components/Loading/LoadingScreen";
import { Tooltip } from "@/components/Onboarding/Tooltip";
import { SectionCard } from "@/components/Section/SectionCard";

// 5. Hooks
import {
  useLoginStudent,
  useSections,
  useUnsubscribeFromCourse,
} from "@/hooks/query";

// 6. Services & utilities
import {
  getCourseProgress,
  getNumberOfCompletedComponents,
  sanitizeStrapiImageUrl
} from "@/services/utils";
import { colors } from "@/theme/colors";
import { t } from "@/i18n";

// 7. Types
import { Course, ProgressTuple, Section } from "@/types";

// 8. Assets
import ImageNotFound from "@/assets/images/imageNotFound.png";

export interface CourseOverviewScreenProps {
  route: {
    params: {
      course: Course;
    };
  };
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 80, // Space for cancel button
  },
  sectionListContainer: {
    maxHeight: 328, // Approx 4 section cards (82px each)
  },
  headerContainer: {
    marginBottom: 80,
  },
  cancelContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 16,
    paddingBottom: 20,
    alignItems: "center",
    backgroundColor: colors.surfaceSubtleCyan,
  },
});

/**
 * Course overview screen.
 *
 * @param route - The route object containing the course data.
 */
const CourseOverviewScreen = ({
  route,
}: CourseOverviewScreenProps): JSX.Element => {
  const { course } = route.params;

  const navigation = useNavigation();

  const [studentProgress, setStudentProgress] = useState<ProgressTuple>([
    0, 0, 0,
  ]);
  const [sectionProgress, setSectionProgress] = useState<
    Record<string, number>
  >({});
  const [currentSection, setCurrentSection] = useState<Section | null>(null);
  const [imageError, setImageError] = useState(false);

  const loginStudentQuery = useLoginStudent();
  const unsubscribeFromCourseQuery = useUnsubscribeFromCourse();
  const sectionQuery = useSections(course.courseId);

  const student = loginStudentQuery.data;

  const imageUrl = sanitizeStrapiImageUrl(course.image);

  // Reset image error state when course changes
  useEffect(() => {
    setImageError(false);
  }, [course.courseId]);

  useEffect(() => {
    if (!sectionQuery.data) {
      return;
    }

    const newProgress: Record<string, number> = {};

    sectionQuery.data.forEach((section) => {
      newProgress[section.sectionId] = getNumberOfCompletedComponents(
        student,
        section,
      );
    });

    setSectionProgress(newProgress);
  }, [sectionQuery.data, student]);

  useEffect(() => {
    if (!sectionQuery.data) {
      return;
    }

    const incompleteSection = sectionQuery.data.find((section) => {
      const completedComponents = sectionProgress[section.sectionId] || 0;

      return completedComponents < section.components.length;
    });

    setCurrentSection(incompleteSection ?? null);
  }, [sectionProgress, sectionQuery.data]);

  useEffect(() => {
    if (!sectionQuery.data) {
      return;
    }

    const updateProgress = () => {
      const progress = getCourseProgress(student, sectionQuery.data);

      setStudentProgress(progress);
    };

    updateProgress();

    return navigation.addListener("focus", () => {
      updateProgress();
    });
  }, [navigation, course, student, sectionQuery.data]);

  const unsubAlert = (): void => {
    Alert.alert(t("course.cancel-subscription"), t("general.confirmation"), [
      {
        text: t("general.no"),
        style: "cancel",
      },
      {
        text: t("general.yes"),
        onPress: () => {
          unsubscribeFromCourseQuery.mutate({
            userId: loginStudentQuery.data.userInfo.id,
            courseId: course.courseId,
          });

          // @ts-expect-error The error will disappear when we migrate to Expo Router
          navigation.navigate("HomeStack", { screen: "Meus cursos" });
        },
      },
    ]);
  };

  if (sectionQuery.isLoading) {
    return <LoadingScreen />;
  }

  const sections = sectionQuery.data ?? [];

  return (
    <SafeAreaView>
      <TouchableOpacity
        className="absolute left-5 top-28 z-10 pr-3"
        onPress={() => {
          // @ts-expect-error The error will disappear when we migrate to Expo Router
          navigation.navigate("HomeStack", { screen: "Meus cursos" });
        }}
      >
        <MaterialCommunityIcons
          name="chevron-left"
          className="rounded-[50px] bg-surfaceDefaultGrayscale text-surfaceDarker"
          size={30}
        />
      </TouchableOpacity>
      <ScrollView
        className="bg-surfaceSubtleGrayscale"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex w-full items-center">
          <View className="flex w-full items-center justify-between">
            {imageUrl &&
            !imageError &&
            (imageUrl.startsWith("http://") ||
              imageUrl.startsWith("https://")) ? (
              <Image
                source={{ uri: imageUrl }}
                className="h-[296px] w-full object-cover"
                onError={() => {
                  setImageError(true);
                }}
              />
            ) : (
              <Image
                source={ImageNotFound}
                className="h-[208px] w-full"
                resizeMode="cover"
              />
            )}

            {/* Circular Back Button Overlay */}
            <Pressable
              className="absolute left-[27px] top-[57px] h-[30px] w-[30px] items-center justify-center rounded-full"
              style={{ backgroundColor: colors.lightGray }}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <MaterialCommunityIcons
                name="chevron-left"
                size={24}
                color={colors.textBodyGrayscale}
              />
            </Pressable>

            {/* Course Info Card - OVERLAPPING */}
            <View className="absolute left-12 right-12 top-[151px]">
              <CourseInfoCard
                course={course}
                progress={studentProgress}
                points={0}
              />
            </View>
          </View>

          {/* Começar Curso Button */}
          <View className="mx-10 mb-10 mt-10">
            <StartCourseButton
              onPress={() => {
                if (currentSection) {
                  // @ts-expect-error The error will disappear when we migrate to Expo Router
                  navigation.navigate("Components", {
                    section: currentSection,
                    parsedCourse: course,
                  });
                }
              }}
              disabled={!currentSection}
            />
          </View>

          {/* Tooltip */}
          {sections.length > 0 && (
            <View className="relative">
              <Tooltip
                position={{ top: 16, left: 48 }}
                tooltipKey="CourseOverview"
                uniCodeIcon="🎓"
                tailSide="bottom"
                tailPosition={20}
              >
                <Text className="text-body-regular">{t("course.tooltip")}</Text>
              </Tooltip>
            </View>
          )}

          {/* Section List - Scrollable with max 4 visible */}
          {sections.length > 0 && (
            <ScrollView
              style={styles.sectionListContainer}
              className="mx-6 mb-6"
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              <View className="gap-5">
                {sections.map((section) => {
                  const completedComponents =
                    sectionProgress[section.sectionId] || 0;
                  return (
                    <SectionCard
                      key={section.sectionId}
                      numOfEntries={section.components.length}
                      title={section.title}
                      icon="chevron-right"
                      progress={completedComponents}
                      onPress={() => {
                        // @ts-expect-error The error will disappear when we migrate to Expo Router
                        navigation.navigate("Section", {
                          course,
                          section,
                        });
                      }}
                    />
                  );
                })}
              </View>
            </ScrollView>
          )}
        </ScrollView>

        {/* Cancel Subscription Link - Sticky at bottom above nav */}
        <View style={styles.cancelContainer}>
          <Pressable onPress={unsubAlert}>
            <Text className="text-surfaceDefaultRed underline text-body-bold">
              {t("course.withdraw")}
            </Text>
          </Pressable>
        </View>
      </View>
    </BaseScreen>
  );
};

export default CourseOverviewScreen;
