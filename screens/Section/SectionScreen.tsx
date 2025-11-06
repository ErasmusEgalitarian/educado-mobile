import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { checkProgressSection } from "@/services/utils";
import { ScrollView } from "react-native-gesture-handler";
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
import { useSectionComponents } from "@/hooks/query";

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
 * @param route
 */
const SectionScreen = ({ route }: SectionScreenProps): ReactElement => {
  const { course, section } = route.params;

  const [completedCompAmount, setCompletedCompAmount] = useState(0);

  const navigation = useNavigation();

  const sectionComponentQuery = useSectionComponents(section.sectionId);

  const sectionComponents = sectionComponentQuery.data ?? [];

  useEffect(() => {
    const setProgress = async () => {
      setCompletedCompAmount(await checkProgressSection(section.sectionId));
    };

    void setProgress();
  }, [section.sectionId]);

  const getProgressStatus = (index: number) => {
    if (index < completedCompAmount) {
      return [2, 2];
    } else {
      return [0, 2];
    }
  };

  const navigateToComponent = (compIndex: number) => {
    // @ts-expect-error This type error gets fixed when moving to Expo Router
    navigation.navigate("Components", {
      section: section,
      parsedCourse: course,
      parsedComponentIndex: compIndex,
    });
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
        {sectionComponents.length === 0 ? null : (
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
                    navigateToComponent(index);
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
