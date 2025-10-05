import React from "react";
import tailwindConfig from "../../tailwind.config.js";
import {
  Modal,
  View,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Text from "../General/Text.js";
import CardLabel from "./CardLabel.js";
import CustomRating from "./CustomRating.js";
import CourseButton from "./CourseButton.jsx";
import * as Utility from "../../services/utils.js";
import { ScrollView } from "react-native-gesture-handler";
import {
  subscribe,
  addCourseToStudent,
} from "../../services/storage-service.js";
import { useNavigation } from "@react-navigation/native";
import InfoBox from "./InfoBox.jsx";

const BottomDrawer = ({ toggleModal, course, drawerState, subscribed }) => {
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();

  const navigation = useNavigation();

  const subscribeCourse = (course) => {
    toggleModal();
    subscribe(course.courseId);
    addCourseToStudent(course.courseId);
    navigation.navigate("Section", { course });
  };

  const navigateCourse = (course) => {
    toggleModal();
    navigation.navigate("Section", { course });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={drawerState}
      onRequestClose={() => toggleModal()}
    >
      <View
        className="flex-1"
        style={{
          backgroundColor: tailwindConfig.theme.colors.surfaceSubtleCyan,
        }}
      />

      <View
        className="flex-start absolute bottom-0 h-full w-full justify-between rounded-t-[40px] bg-surfaceSubtleCyan px-8 py-10 shadow-2xl shadow-black"
        style={{ height: windowHeight * 0.87, width: windowWidth * 1 }}
      >
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="font-sans-semi-bold text-2xl text-textTitle">
            {course.title}
          </Text>
          <TouchableOpacity onPress={() => toggleModal()}>
            <MaterialCommunityIcons
              name={"chevron-down"}
              size={25}
              color={tailwindConfig.theme.colors.textTitle}
            />
          </TouchableOpacity>
        </View>

        <View className="flex-column mb-4">
          <View className="flex-column flex-wrap items-start justify-start pb-2">
            <CardLabel
              title={Utility.determineCategory(course.category)}
              icon={Utility.determineIcon(course.category)}
              color={tailwindConfig.theme.colors.grayScale}
            />
            <View className="mb-1 w-2.5" />
            <CardLabel
              title={Utility.formatHours(course.estimatedHours)}
              icon={"clock"}
              color={tailwindConfig.theme.colors.grayScale}
            />
            <View className="mb-1 w-2.5" />
            <CardLabel
              title={Utility.getDifficultyLabel(course.difficulty)}
              icon={"equalizer"}
              color={tailwindConfig.theme.colors.grayScale}
            />
            <View className="mb-1 w-2.5" />
            <View>
              {subscribed ? (
                <View className="mb-1 w-full flex-row">
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={13}
                    color={tailwindConfig.theme.colors.surfaceDefaultGreen}
                  />
                  <Text className="flex-start pl-1 font-sans-bold text-xs text-surfaceDefaultGreen">
                    Inscrição realizada
                  </Text>
                </View>
              ) : null}
            </View>
            <CustomRating rating={course.rating} />
          </View>
        </View>

        <View className="w-full border-b-[1px] border-surfaceDisabled opacity-50" />

        <ScrollView className="inner-shadow my-4 max-h-24 w-full">
          <Text className="text-m flex-start w-full">{course.description}</Text>
        </ScrollView>

        <InfoBox course={course} />

        <View className="w-full">
          {subscribed ? (
            <CourseButton course={course} onPress={navigateCourse}>
              <View className="flex-row items-center">
                <Text className="mr-3 py-1 font-sans-bold text-lg text-surfaceSubtleGrayscale">
                  Continuar Curso
                </Text>
                <MaterialCommunityIcons
                  name="play-circle-outline"
                  size={20}
                  color={tailwindConfig.theme.colors.surfaceSubtleGrayscale}
                />
              </View>
            </CourseButton>
          ) : (
            <CourseButton course={course} onPress={subscribeCourse}>
              <Text className="p-1 font-sans-bold text-lg text-surfaceSubtleGrayscale">
                Inscreva-se agora
              </Text>
            </CourseButton>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default BottomDrawer;
