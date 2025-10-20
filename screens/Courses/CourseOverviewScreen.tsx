import type { ReactElement } from "react";
import { useState, useEffect } from "react";
import { Alert, View, TouchableOpacity, Image, Text } from "react-native";
import * as StorageService from "@/services/storage-service";
import { unsubscribe } from "@/services/storage-service";
import { SectionCard } from "@/components/Section/SectionCard";
import { ScrollView } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { CustomProgressBar } from "@/components/Exercise/CustomProgressBar";
import { SubscriptionCancelButton } from "@/components/Section/CancelSubscriptionButton";
import { checkProgressCourse, checkProgressSection } from "@/services/utils";
import { ContinueSectionButton } from "@/components/Section/ContinueSectionButton";
import Tooltip from "@/components/Onboarding/Tooltip";
import ImageNotFound from "@/assets/images/imageNotFound.png";
import DownloadCourseButton from "@/components/Courses/CourseCard/DownloadCourseButton";
import { getBucketImage } from "@/api/api";
import type { Course } from "@/types/course";
import type { Section } from "@/types/section";
import { Shadow } from "react-native-shadow-2";
import { colors } from "@/theme/colors";
import { t } from "@/i18n";

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
 * @param route
 */
const CourseOverviewScreen = ({
  route,
}: CourseOverviewScreenProps): ReactElement => {
  const { course } = route.params;
  const navigation = useNavigation();
  const [sections, setSections] = useState<null | Section[]>(null);
  const [studentProgress, setStudentProgress] = useState([0, 0, 0]);
  const [sectionProgress, setSectionProgress] = useState<
    Record<string, number>
  >({});
  const [currentSection, setCurrentSection] = useState<Section | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState<unknown | null>(null);

  const loadSections = async (id: string, signal: AbortSignal) => {
    const sectionData = await StorageService.getSectionList(id, signal);
    setSections(sectionData);
  };

  const checkProgressInSection = async (sectionId: string) => {
    const completed = await checkProgressSection(sectionId);
    setSectionProgress((prevProgress) => ({
      ...prevProgress,
      [sectionId]: completed,
    }));
  };

  useEffect(() => {
    const abortController = new AbortController();

    const loadData = async () => {
      await loadSections(course.courseId, abortController.signal);
    };

    void loadData();

    return () => {
      abortController.abort();
    };
  }, [course.courseId]);

  useEffect(() => {
    if (sections) {
      sections.forEach((section) => {
        void checkProgressInSection(section.sectionId);
      });
    }
  }, [sections]);

  useEffect(() => {
    if (sections) {
      const incompleteSection = sections.find((section) => {
        const completedComponents = sectionProgress[section.sectionId] || 0;
        return completedComponents < section.components.length;
      });
      setCurrentSection(incompleteSection ?? null);
    }
  }, [sectionProgress, sections]);

  useEffect(() => {
    const checkProgress = async () => {
      const progress = await checkProgressCourse(course.courseId);
      setStudentProgress(progress);
    };

    return navigation.addListener("focus", () => {
      void checkProgress();

      if (sections) {
        sections.forEach((section) => {
          void checkProgressInSection(section.sectionId);
        });
      }
    });
  }, [navigation, sections, course.courseId]);

  useEffect(() => {
    if (!coverImage) {
      const fetchImage = async () => {
        try {
          const image = await getBucketImage(course.courseId + "_c");
          setCoverImage(image);
        } catch (error) {
          setImageError(error);
          console.error(error);
        }
      };

      void fetchImage();
    }
  }, [course, coverImage]);

  const unsubAlert = () => {
    Alert.alert(t("course.cancel-subscription"), t("general.confirmation"), [
      {
        text: t("general.no"),
        style: "cancel",
      },
      {
        text: t("general.yes"),
        onPress: () => {
          void unsubscribe(course.courseId);

          setTimeout(() => {
            navigation.navigate("Meus cursos" as never);
          }, 300);
        },
      },
    ]);
  };

  const navigateToCurrentSection = () => {
    if (currentSection) {
      navigation.navigate(
        ...([
          "Components",
          {
            section: currentSection,
            parsedCourse: course,
          },
        ] as never),
      );
    }
  };

  const navigateToSpecifiedSection = (section: Section) => {
    navigation.navigate(
      ...([
        "Section",
        {
          course: course,
          section: section,
        },
      ] as never),
    );
  };

  return (
    <>
      {/* Back Button */}
      <TouchableOpacity
        className="absolute left-5 top-10 z-10 pr-3"
        onPress={() => navigation.navigate("Meus cursos" as never)}
      >
        <MaterialCommunityIcons
          name="chevron-left"
          style={{ backgroundColor: colors.lightGray, borderRadius: 50 }}
          size={30}
          color={colors.projectBlack}
        />
      </TouchableOpacity>
      <ScrollView
        className="bg-surfaceSubtleGrayscale"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex w-full items-center">
          <View className="flex w-full items-center justify-between">
            {!imageError && coverImage ? (
              <Image
                source={{ uri: coverImage }}
                style={{ width: "100%", height: 296, resizeMode: "cover" }}
              />
            ) : (
              <Image source={ImageNotFound} />
            )}
          </View>
          <View className="mt-[-15%]">
            <Shadow startColor="#28363E14" distance={6} offset={[0, 3]}>
              <View
                className="flex w-[293px] bg-surfaceSubtleGrayscale p-[16px]"
                style={{ borderRadius: 15, transform: [{ scale: 1.02 }] }}
              >
                <View className="flex flex-row justify-between">
                  {/* Course Title */}
                  <Text className="h3-sm-regular max-w-[80%] text-[24px]">
                    {course.title}
                  </Text>
                  {/* TODO: Button to download course should be implemented */}
                  <DownloadCourseButton course={course} disabled={true} />
                </View>
                {/* Progress Bar */}
                <View className="flex h-6 justify-center rounded-sm border-y-[1px] border-lightGray">
                  <CustomProgressBar
                    width={63}
                    progress={studentProgress}
                    height={1}
                    displayLabel={false}
                  ></CustomProgressBar>
                </View>

                <View className="flex w-full flex-row items-center justify-between">
                  <View className="flex flex-row">
                    <MaterialCommunityIcons
                      name="crown-circle"
                      size={20}
                      color="orange"
                    />
                    {/* TODO: Points should be implemented */}
                    <Text>?? pontos</Text>
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
                    <Text>{studentProgress[0]}% concluído</Text>
                  </View>
                </View>
              </View>
            </Shadow>
          </View>
        </View>
        <View className="my-6 flex items-center px-[25px]">
          {/* Navigate to Current Section Button */}
          <ContinueSectionButton onPress={navigateToCurrentSection} />
        </View>
        {/* Conditionally render the sections if they exist */}
        {sections ? (
          sections.length === 0 ? null : (
            <View className="flex-[1] flex-col">
              <Tooltip
                position={{
                  top: -30,
                  left: 70,
                  right: 30,
                  bottom: 24,
                }}
                text={
                  "Essa é a página do seu curso. É aqui que você vai acessar as aulas e acompanhar seu progresso."
                }
                tailSide="right"
                tailPosition="20%"
                uniqueKey="Sections"
                uniCodeChar="🎓"
              />
              {/* Section Cards */}
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
                        navigateToSpecifiedSection(section);
                      }}
                    ></SectionCard>
                  );
                })}
              </View>
            </View>
          )
        ) : null}
        <SubscriptionCancelButton onPress={unsubAlert} />
      </ScrollView>
    </>
  );
};

export default CourseOverviewScreen;
