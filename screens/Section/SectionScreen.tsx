import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as StorageService from "@/services/storage-service";
import { checkProgressSection } from "@/services/utils";
import { ScrollView } from "react-native-gesture-handler";
import { SectionCard } from "@/components/Section/SectionCard";
import { Component } from "@/types/component";
import { Course } from "@/types/course";
import { Section } from "@/types/section";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const [components, setComponents] = useState<Component[]>([]);
  const [completedCompAmount, setCompletedCompAmount] = useState(0);

  const navigation = useNavigation();

  const loadComponents = async (id: string, signal: AbortSignal) => {
    const componentsData = await StorageService.getComponentList(id, signal);

    setComponents(componentsData);
  };

  useEffect(() => {
    const abortController = new AbortController();

    const loadData = async () => {
      await loadComponents(section.sectionId, abortController.signal);

      setCompletedCompAmount(await checkProgressSection(section.sectionId));
    };

    void loadData();

    return () => {
      abortController.abort();
    };
  }, [section.sectionId]);

  const getProgressStatus = (compIndex: number) => {
    if (compIndex < completedCompAmount) {
      return [2, 2];
    } else {
      return [0, 2];
    }
  };

  const navigateBack = () => {
    navigation.goBack();
  };

  const navigateToComponent = (compIndex: number) => {
    // @ts-expect-error This type error gets fixed when moving to Expo Router
    navigation.navigate("Components", {
      section: section,
      parsedCourse: course,
      parsedComponentIndex: compIndex,
    });
  };

  const getIcon = (component: Component) => {
    return component.type === "exercise"
      ? "book-open-blank-variant"
      : component.component.contentType === "text"
        ? "book-edit"
        : "play-circle";
  };

  return (
    <SafeAreaView>
      <ScrollView className="h-full bg-secondary">
        <View className="mx-10 mt-10 flex-col">
          <View className="flex-row">
            <TouchableOpacity onPress={navigateBack}>
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
              <Text className="border-b-[1px] border-lightGray pb-4 text-subtitle-regular">
                {section.description}
              </Text>
            </View>
          </View>
        </View>
        {components.length === 0 ? null : (
          <View>
            {components.map((component: Component, i) => {
              const isDisabled = i > completedCompAmount;
              const [progress, amount] = getProgressStatus(i);
              return (
                <SectionCard
                  disableProgressNumbers={true}
                  numOfEntries={amount}
                  progress={progress}
                  title={component.component.title}
                  icon={getIcon(component)}
                  disabledIcon="lock-outline"
                  key={i}
                  onPress={() => {
                    navigateToComponent(i);
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
