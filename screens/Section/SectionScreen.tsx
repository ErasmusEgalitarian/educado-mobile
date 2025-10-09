import { useState, useEffect } from "react";
import type { ReactElement } from "react";
import { View, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Text from "@/components/General/Text";
import * as StorageService from "@/services/storage-service";
import { checkProgressSection } from "@/services/utils";
import { ScrollView } from "react-native-gesture-handler";
import SectionCard from "@/components/Section/SectionCard";
import { Component } from "@/types/component";
import { Course } from "@/types/course";
import { Section } from "@/types/section";

export interface SectionScreenProps {
  route: {
    params: {
      section: Section;
      course: Course;
    };
  };
}

const SectionScreen = ({ route }: SectionScreenProps): ReactElement => {
  const { course, section } = route.params;
  const [components, setComponents] = useState<Component[]>([]);
  const [completedCompAmount, setCompletedCompAmount] = useState(0);

  const navigation = useNavigation();
  const loadComponents = async (id: string) => {
    const componentsData = await StorageService.getComponentList(id);
    setComponents(componentsData);
  };

  useEffect(() => {
    let componentIsMounted = true;

    const loadData = async () => {
      await loadComponents(section.sectionId);
      setCompletedCompAmount(await checkProgressSection(section.sectionId));
    };

    if (componentIsMounted) {
      loadData();
    }

    return () => {
      componentIsMounted = false;
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
    // @ts-ignore This type error gets fixed when moving to app router
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
    <ScrollView className="h-full bg-secondary">
      {/* Back Button */}
      <TouchableOpacity
        className="absolute left-5 top-10 z-10 pr-3"
        onPress={navigateBack}
      >
        <MaterialCommunityIcons name="chevron-left" size={25} color="black" />
      </TouchableOpacity>
      <View className="mx-[18] my-6 flex">
        <View className="flex-none items-center justify-center py-6">
          <Text className="font-montserrat text-[20px]">{course.title}</Text>
        </View>
        <View className="flex-initial py-2">
          <Text className="font-montserrat-bold text-[28px]">
            {section.title}
          </Text>
          <Text className="border-b-[1px] border-lightGray font-montserrat text-[16px]">
            {section.description}
          </Text>
        </View>
      </View>
      {components ? (
        components.length === 0 ? null : (
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
                  onPress={() => navigateToComponent(i)}
                  disabled={isDisabled}
                />
              );
            })}
          </View>
        )
      ) : null}
    </ScrollView>
  );
};

export default SectionScreen;
