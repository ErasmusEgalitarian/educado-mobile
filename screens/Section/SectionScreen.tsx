import { useState, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Text from "../../components/General/Text";
import * as StorageService from "../../services/storage-service";
import { checkProgressSection } from "../../services/utils";
import { ScrollView } from "react-native-gesture-handler";
import PropTypes from "prop-types";

export default function SectionScreen({ route }) {
  const { course, section } = route.params;
  const [components, setComponents] = useState(null);
  const [completedCompAmount, setCompletedCompAmount] = useState(0);

  const navigation = useNavigation();
  async function loadComponents(id) {
    const componentsData = await StorageService.getComponentList(id);
    setComponents(componentsData);
  }

  useEffect(() => {
    let componentIsMounted = true;

    async function loadData() {
      await loadComponents(section.sectionId);
      setCompletedCompAmount(await checkProgressSection(section.sectionId));
    }

    if (componentIsMounted) {
      loadData();
    }

    return () => {
      componentIsMounted = false;
    };
  }, []);

  const getProgressStatus = (compIndex) => {
    if (compIndex < completedCompAmount) {
      return "Concluído";
    } else if (compIndex == completedCompAmount) {
      return "Em progresso";
    } else {
      return "Não iniciado";
    }
  };

  const navigateBack = () => {
    navigation.goBack();
  };
  const navigateToComponent = (compIndex) => {
    navigation.navigate("Components", {
      section: section,
      parsedCourse: course,
      parsedComponentIndex: compIndex,
    });
  };

  return (
    <ScrollView className="h-full bg-secondary">
      {/* Back Button */}
      <TouchableOpacity
        className="absolute top-10 left-5 z-10 pr-3"
        onPress={navigateBack}
      >
        <MaterialCommunityIcons name="chevron-left" size={25} color="black" />
      </TouchableOpacity>
      <View className="my-6 mx-[18] flex">
        <View className="flex-none items-center justify-center py-6">
          <Text className="font-montserrat text-[20px]">{course.title}</Text>
        </View>
        <View className="flex-inital py-2">
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
            {components.map((component, i) => {
              const isDisabled = i > completedCompAmount;
              return (
                <TouchableOpacity
                  key={i}
                  className={`shadow-opacity-[0.3] elevation-[8] mx-[18] mb-[15] overflow-hidden rounded-lg border-[1px] border-lightGray bg-secondary shadow-lg ${isDisabled ? "opacity-50" : ""}`}
                  onPress={() => {
                    navigateToComponent(i);
                  }}
                  disabled={isDisabled}
                >
                  <View className="flex-row items-center justify-between px-[25] py-[15]">
                    <View>
                      <Text className="font-montserrat-bold text-[18px]">
                        {component.component.title}
                      </Text>
                      <Text>
                        {getProgressStatus(i)}
                        {i < completedCompAmount ? (
                          <MaterialCommunityIcons
                            testID={"check-circle"}
                            name={"check-circle"}
                            size={16}
                            color="green"
                          />
                        ) : (
                          ""
                        )}
                      </Text>
                    </View>

                    {component.type === "exercise" ? (
                      <MaterialCommunityIcons
                        name="book-open-blank-variant"
                        size={30}
                        color="#166276"
                      />
                    ) : component.component.contentType === "text" ? (
                      <MaterialCommunityIcons
                        name="book-edit"
                        size={30}
                        color="#166276"
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name="play-circle"
                        size={30}
                        color="#166276"
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )
      ) : null}
    </ScrollView>
  );
}

SectionScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      section: PropTypes.object.isRequired,
      course: PropTypes.object.isRequired,
    }).isRequired,
  }).isRequired,
};
