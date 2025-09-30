import { useState, useEffect } from "react";
import { Alert, View, TouchableOpacity, Image } from "react-native";
import Text from "../../components/General/Text";
import * as StorageService from "../../services/storage-service";
import SectionCard from "../../components/Section/SectionCard";
import { ScrollView } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import CustomProgressBar from "../../components/Exercise/CustomProgressBar";
import SubscriptionCancelButton from "../../components/Section/CancelSubscriptionButton";
import { unsubscribe } from "../../services/storage-service";
import PropTypes from "prop-types";
import {
  checkProgressCourse,
  checkProgressSection,
} from "../../services/utils";
import ContinueSectionButton from "../../components/Section/ContinueSectionButton";
import Tooltip from "../../components/Onboarding/Tooltip";
import ImageNotFound from "../../assets/images/imageNotFound.png";
import DownloadCourseButton from "../../components/Courses/CourseCard/DownloadCourseButton";
import { getBucketImage } from "../../api/api";

export default function CourseOverviewScreen({ route }) {
  CourseOverviewScreen.propTypes = {
    route: PropTypes.object,
  };
  const { course } = route.params;
  const navigation = useNavigation();
  const [sections, setSections] = useState(null);
  const [studentProgress, setStudentProgress] = useState(0);
  const [sectionProgress, setSectionProgress] = useState({});
  const [currentSection, setCurrentSection] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [coverImage, setCoverImage] = useState(null);

  async function loadSections(id) {
    const sectionData = await StorageService.getSectionList(id);
    setSections(sectionData);
  }

  const checkProgress = async () => {
    const progress = await checkProgressCourse(course.courseId);
    setStudentProgress(progress);
  };

  const checkProgressInSection = async (sectionId) => {
    const completed = await checkProgressSection(sectionId);
    setSectionProgress((prevProgress) => ({
      ...prevProgress,
      [sectionId]: completed,
    }));
  };

  useEffect(() => {
    let componentIsMounted = true;

    async function loadData() {
      await loadSections(course.courseId);
    }

    if (componentIsMounted) {
      loadData();
    }

    return () => {
      componentIsMounted = false;
    };
  }, []);

  useEffect(() => {
    if (sections) {
      sections.forEach((section) => {
        checkProgressInSection(section.sectionId);
      });
    }
  }, [sections]);

  useEffect(() => {
    if (sections) {
      const incompleteSection = sections.find((section) => {
        const completedComponents = sectionProgress[section.sectionId] || 0;
        return completedComponents < section.components.length;
      });
      setCurrentSection(incompleteSection);
    }
  }, [sectionProgress, sections]);

  useEffect(() => {
    const update = navigation.addListener("focus", () => {
      checkProgress();
      if (sections) {
        sections.forEach((section) => {
          checkProgressInSection(section.sectionId);
        });
      }
    });
    return update;
  }, [navigation]);

  useEffect(() => {
    if (!coverImage && course) {
      const fetchImage = async () => {
        try {
          const image = await getBucketImage(course.courseId + "_c");
          if (typeof image === "string") {
            setCoverImage(image);
          } else {
            throw new Error();
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchImage();
    }
  }, [course]);

  const unsubAlert = () =>
    Alert.alert("Cancelar subscrição", "Tem certeza?", [
      {
        text: "Não",
        style: "cancel",
      },
      {
        text: "Sim",
        onPress: () => {
          unsubscribe(course.courseId);
          setTimeout(() => {
            navigation.navigate("Meus cursos");
          }, 300);
        },
      },
    ]);

  const navigateToCurrentSection = () => {
    if (currentSection) {
      navigation.navigate("Components", {
        section: currentSection,
        parsedCourse: course,
      });
    }
  };
  const navigateToSpecifiedSection = (section) => {
    navigation.navigate("Section", {
      course: course,
      section: section,
    });
  };

  return (
    <>
      {/* Back Button */}
      <TouchableOpacity
        className="absolute top-10 left-5 z-10 pr-3"
        onPress={() => navigation.navigate("Meus cursos")}
      >
        <MaterialCommunityIcons
          name="chevron-left"
          style={{ backgroundColor: "rgba(255,255,255,0.5)", borderRadius: 50 }}
          size={25}
          color="black"
        />
      </TouchableOpacity>
      <ScrollView className="bg-secondary" showsVerticalScrollIndicator={false}>
        <View className="flex flex-row flex-wrap justify-between bg-secondary">
          <View className="flex w-full items-center">
            <View className="flex w-full items-center justify-between">
              {coverImage ? (
                <Image
                  class="h-full max-w-full"
                  source={{ uri: coverImage }}
                  style={{ width: "100%", height: 296, resizeMode: "cover" }}
                />
              ) : (
                <Image class="h-full max-w-full" source={ImageNotFound} />
              )}
            </View>
            <View className="mt-[-10%] flex w-[293px] rounded-xl bg-projectWhite p-[14px]">
              <View className="flex flex-row justify-between">
                {/* Course Title */}
                <Text className="line-height-[29px] max-w-[80%] font-montserrat-bold text-[24px]">
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
                  <Text>{studentProgress}% concluído</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View className="my-6 flex items-center px-4">
          {/* Navigate to Current Section Button */}
          <ContinueSectionButton onPress={navigateToCurrentSection} />
        </View>
        {/* Conditionally render the sections if they exist */}
        {sections ? (
          sections.length === 0 ? null : (
            <View className="flex-[1] flex-col bg-secondary">
              <Tooltip
                isVisible={isVisible}
                position={{
                  top: -30,
                  left: 70,
                  right: 30,
                  bottom: 24,
                }}
                setIsVisible={setIsVisible}
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
                      key={i}
                      section={section}
                      progress={completedComponents}
                      onPress={() => navigateToSpecifiedSection(section)}
                    ></SectionCard>
                  );
                })}
              </View>
            </View>
          )
        ) : null}
      </ScrollView>
      <View className="bg-secondary">
        {/* Unsubscribe Button */}
        <SubscriptionCancelButton onPress={unsubAlert} />
      </View>
    </>
  );
}
