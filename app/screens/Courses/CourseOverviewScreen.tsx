import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SectionCard } from "@/components/Section/SectionCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { CustomProgressBar } from "@/components/Exercise/CustomProgressBar";
import { SubscriptionCancelButton } from "@/components/Section/CancelSubscriptionButton";
import {
  getCourseProgress,
  getNumberOfCompletedComponents,
  sanitizeStrapiImageUrl,
} from "@/services/utils";
import { ContinueSectionButton } from "@/components/Section/ContinueSectionButton";
import { Tooltip } from "@/components/Onboarding/Tooltip";
import ImageNotFound from "@/assets/images/imageNotFound.png";
import DownloadCourseButton from "@/components/Courses/CourseCard/DownloadCourseButton";
import { Course, ProgressTuple, Section } from "@/types";
import { Shadow } from "react-native-shadow-2";
import { t } from "@/i18n";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useLoginStudent,
  useSections,
  useUnsubscribeFromCourse,
} from "@/hooks/query";
import LoadingScreen from "@/components/Loading/LoadingScreen";

export interface CourseOverviewScreenProps {
  route: {
    params: {
      course: Course;
    };
  };
}

/**
 * Course overview screen.
 *
 * @param route - The route object containing the course data.
 */
const CourseOverviewScreen = ({ route }: CourseOverviewScreenProps) => {
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

  const unsubAlert = () => {
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
              <Image source={ImageNotFound} />
            )}
          </View>
          <View className="mt-[-15%]">
            <Shadow startColor="#28363E14" distance={6} offset={[0, 3]}>
              <View className="flex w-[293px] rounded-2xl bg-surfaceSubtleGrayscale p-[16px]">
                <View className="flex flex-row justify-between">
                  <Text className="h3-sm-regular max-w-[80%]">
                    {course.title}
                  </Text>
                  {/* TODO: Button to download course should be implemented */}
                  <DownloadCourseButton course={course} disabled={true} />
                </View>
                <View className="flex h-6 justify-center rounded-sm border-y-[1px] border-surfaceDefaultGrayscale">
                  <CustomProgressBar
                    width={63}
                    progress={studentProgress}
                    height={1}
                    displayLabel={false}
                  />
                </View>
                <View className="flex w-full flex-row items-center justify-between">
                  <View className="flex flex-row">
                    <MaterialCommunityIcons
                      name="crown-circle"
                      size={20}
                      color="orange"
                    />
                    {/* TODO: Points should be implemented */}
                    <Text className="ml-1">{`0 ${t("course.points")}`}</Text>
                  </View>
                  <MaterialCommunityIcons
                    name="circle-small"
                    size={30}
                    color="gray"
                  />
                  <View className="flex flex-row">
                    <MaterialCommunityIcons
                      name="lightning-bolt"
                      size={20}
                      color="orange"
                    />
                    <Text className="ml-1">
                      {`${String(studentProgress[0])} ${t("course.completed-low")}`}
                    </Text>
                  </View>
                </View>
              </View>
            </Shadow>
          </View>
        </View>
        <View className="my-6 flex items-center px-[25px]">
          <ContinueSectionButton
            onPress={() => {
              if (currentSection) {
                // @ts-expect-error The error will disappear when we migrate to Expo Router
                navigation.navigate("Components", {
                  section: currentSection,
                  parsedCourse: course,
                });
              }
            }}
          />
        </View>
        {sections.length > 0 && (
          <View className="flex-[1] flex-col">
            <Tooltip
              position={{
                top: -30,
                left: 70,
              }}
              tooltipKey="Sections"
              uniCodeIcon="🎓"
              tailSide="right"
              tailPosition={20}
            >
              {t("course.tooltip")}
            </Tooltip>
            <View>
              {sections.map((section, i) => {
                const completedComponents =
                  sectionProgress[section.sectionId] || 0;
                return (
                  <SectionCard
                    numOfEntries={section.components.length}
                    title={section.title}
                    icon="chevron-right"
                    key={i}
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
          </View>
        )}
        <SubscriptionCancelButton onPress={unsubAlert} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CourseOverviewScreen;
