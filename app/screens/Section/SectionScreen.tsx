import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getNumberOfCompletedComponents } from "@/services/utils";
import { SectionCard } from "@/components/Section/SectionCard";
import {
  Section,
  SectionComponent,
  Course,
  Icon,
  SectionComponentLecture,
  SectionComponentExercise,
} from "@/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLoginStudent, useSectionComponents } from "@/hooks/query";
import LoadingScreen from "@/components/Loading/LoadingScreen";

export interface SectionScreenProps {
  route: {
    params: {
      section: Section;
      course: Course;
    };
  };
}

/**
 * Section screen.
 *
 * @param route - The route object containing the section and course data.
 */
const SectionScreen = ({ route }: SectionScreenProps) => {
  const { course, section } = route.params;

  const navigation = useNavigation();

  const [completedCompAmount, setCompletedCompAmount] = useState(0);

  const sectionComponentQuery = useSectionComponents(section.sectionId);

  const loginStudentQuery = useLoginStudent();

  const student = loginStudentQuery.data;

  useEffect(() => {
    setCompletedCompAmount(getNumberOfCompletedComponents(student, section));
  }, [student, section]);

  const getProgressStatus = (index: number) => {
    if (index < completedCompAmount) {
      return [2, 2];
    } else {
      return [0, 2];
    }
  };

  const getIcon = (
    sectionComponent: SectionComponent<
      SectionComponentLecture | SectionComponentExercise
    >,
  ): Icon => {
    const { component } = sectionComponent;

    // SectionComponentExercise
    if ("question" in component) {
      return "book-open-blank-variant";
    }

    // SectionComponentLecture
    if ("content" in component) {
      return "book-edit";
    }

    return "play-circle";
  };

  if (sectionComponentQuery.isLoading) {
    return <LoadingScreen />;
  }

  const sectionComponents = sectionComponentQuery.data ?? [];

  return (
    <SafeAreaView>
      <ScrollView className="h-full bg-surfaceSubtleCyan">
        <View className="mx-10 mt-10 flex-col">
          <View className="flex-row">
            <TouchableOpacity onPress={navigation.goBack}>
              <MaterialCommunityIcons
                name="chevron-left"
                size={25}
                color="black"
              />
            </TouchableOpacity>
            <Text className="ml-2 text-h3-sm-regular">{course.title}</Text>
          </View>
          <View className="my-6 flex">
            <View className="flex-initial py-2">
              <Text className="text-h1-sm-bold">{section.title}</Text>
              <Text className="border-b-[1px] border-surfaceDefaultGrayscale pb-4 text-subtitle-regular">
                {section.description}
              </Text>
            </View>
          </View>
        </View>
        {sectionComponents.length > 0 && (
          <View>
            {sectionComponents.map((component, index) => {
              const isDisabled = index > completedCompAmount;

              const [progress, amount] = getProgressStatus(index);

              return (
                <SectionCard
                  disableProgressNumbers={true}
                  numOfEntries={amount}
                  progress={progress}
                  title={component.component.title}
                  icon={getIcon(component)}
                  disabledIcon="lock-outline"
                  key={index}
                  onPress={() => {
                    // @ts-expect-error This type error gets fixed when moving to Expo Router
                    navigation.navigate("Components", {
                      section: section,
                      parsedCourse: course,
                      parsedComponentIndex: index,
                    });
                  }}
                  disabled={isDisabled}
                />
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SectionScreen;
