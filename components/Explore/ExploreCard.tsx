import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import {
  MaterialCommunityIcons,
  AntDesign,
  EvilIcons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import CardLabel from "./CardLabel";
import CustomRating from "./CustomRating";
import SubscriptionButton from "./SubscriptionButton";
import AccessCourseButton from "./AccessCourseButton";
import UpdateDate from "./UpdateDate";
import * as Utility from "../../services/utils";
import PropTypes from "prop-types";
import { ScrollView } from "react-native-gesture-handler";
import colors from "@/theme/colors";

/**
 * This component is used to display a course card.
 * @param course - The course object to be displayed.
 * @param isPublished - Boolean value that indicates if the course is published. If false, the card will not be displayed.
 * @param subscribed - Boolean value that indicates if the user is subscribed to the course.
 * @returns {JSX.Element|null} - Returns a JSX element. If the course is not published, returns null.
 */
export default function ExploreCard({ course, isPublished, subscribed }) {
  const [modalVisible, setModalVisible] = useState(false);

  return isPublished ? (
    <View>
      <View className="bg-surfaceSubtleGrayscale mx-4 mb-4 overflow-hidden rounded-lg p-6 shadow-2xl">
        <View className="flex-col items-center">
          <View className="w-full flex-row items-center justify-between">
            <Text className="text-textTitleGrayscale text-lg font-medium">
              {course.title}
            </Text>
          </View>

          <View className="border-surfaceDisabledGrayscale h-1 w-full border-b-[1px] pt-2 opacity-50"></View>

          <View className="h-[0.5] w-full pt-2" />
          <View className="w-full flex-row items-start justify-between">
            <View className="w-full flex-col items-start justify-between">
              <View className="flex-row flex-wrap items-center justify-start pb-2">
                <CardLabel
                  title={Utility.determineCategory(course.category)}
                  icon={Utility.determineIcon(course.category)}
                />
                <View className="w-2.5" />
                <CardLabel
                  title={Utility.formatHours(course.estimatedHours)}
                  icon={"clock-outline"}
                />
                <View className="w-2.5" />
                <CardLabel
                  title={Utility.getDifficultyLabel(course.difficulty)}
                  icon={"book-multiple-outline"}
                />
              </View>
              <View className="h-1.25 opacity-50" />

              <View className="w-full flex-row items-end justify-between pt-2">
                <CustomRating rating={course.rating} />
                <Pressable onPress={() => setModalVisible(true)}>
                  <View className="border-surfaceDefaultCyan flex-row items-center border-b px-1 py-0.5">
                    <Text className="text-surfaceDefaultCyan mr-1 font-sans-semi-bold text-xs">
                      saiba mais
                    </Text>
                    <MaterialCommunityIcons
                      name="chevron-double-right"
                      size={12}
                      color={colors.surfaceDefaultCyan}
                    />
                  </View>
                </Pressable>
              </View>

              <UpdateDate
                dateUpdated={Utility.getUpdatedDate(course.dateUpdated)}
              />
            </View>
          </View>
        </View>

        <View className="absolute items-start">
          <View className="rotate-[315deg] items-center">
            {subscribed ? (
              <Text className="-left-8 -top-4 bg-yellow px-8 text-xs font-bold text-projectWhite drop-shadow-sm">
                Inscrito
              </Text>
            ) : null}
          </View>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
        scrollable
      >
        {/* Detect touches outside the modal */}
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.transparentBackground}>
            {/* Prevent the modal content from closing the modal when clicked */}
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                <Pressable onPress={() => setModalVisible(false)}>
                  <View className="w-full flex-row items-center justify-between py-4">
                    <Text className="text-textTitleGrayscale text-2xl font-medium">
                      {course.title}
                    </Text>
                    <MaterialIcons
                      name="keyboard-arrow-down"
                      size={34}
                      color={colors.textTitleGrayscale}
                    />
                  </View>
                  <View className="flex-row flex-wrap items-center justify-start pb-4 text-xs">
                    <CardLabel
                      title={Utility.determineCategory(course.category)}
                      icon={Utility.determineIcon(course.category)}
                    />
                    <View className="w-2.5" />
                    <CardLabel
                      title={Utility.formatHours(course.estimatedHours)}
                      icon={"clock-outline"}
                    />
                    <View className="w-2.5" />
                    <CardLabel
                      title={Utility.getDifficultyLabel(course.difficulty)}
                      icon={"book-multiple-outline"}
                    />
                  </View>
                </Pressable>
                <CustomRating rating={course.rating} />
                <View className="border-surfaceDisabledGrayscale mb-4 h-1 w-full border-b-[1px] pt-4 opacity-50"></View>
                <ScrollView style={{ maxHeight: "40%" }}>
                  <Text
                    className="text-textTitleGrayscale text-lg"
                    onStartShouldSetResponder={() => true}
                  >
                    {course.description}
                  </Text>
                </ScrollView>
                <View className="border-textCaptionGrayscale mt-8 rounded-2xl border p-4">
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={24}
                      color={colors.textCaptionGrayscale}
                    />
                    <Text className="text-textTitleGrayscale ml-2 pb-3 text-sm">
                      {course.estimatedHours} horas de conteúdo (vídeos,
                      exercícios, leituras complementares)
                    </Text>
                  </View>
                  <View className="flex-row">
                    <MaterialCommunityIcons
                      name="certificate-outline"
                      size={24}
                      color={colors.textCaptionGrayscale}
                    />
                    <Text className="text-textTitleGrayscale ml-2 pb-3 text-sm">
                      Certificado de Conclusão
                    </Text>
                  </View>
                  <View className="flex-row">
                    <MaterialCommunityIcons
                      name="clock-fast"
                      size={24}
                      color={colors.textCaptionGrayscale}
                    />
                    <Text className="text-textTitleGrayscale ml-2 pb-3 text-sm">
                      Início imediato
                    </Text>
                  </View>
                  <View className="flex-row">
                    <MaterialCommunityIcons
                      name="calendar-month"
                      size={24}
                      color={colors.textCaptionGrayscale}
                    />
                    <Text className="text-textTitleGrayscale ml-2 pb-3 text-sm">
                      Acesso total por 1 ano
                    </Text>
                  </View>
                  <View className="flex-row">
                    <MaterialCommunityIcons
                      name="robot-outline"
                      size={24}
                      color={colors.textCaptionGrayscale}
                    />
                    <Text className="text-textTitleGrayscale ml-2 pb-3 text-sm">
                      Chat e suporte com inteligência artificial
                    </Text>
                  </View>
                  <View className="flex-row">
                    <Octicons
                      name="comment-discussion"
                      size={24}
                      color={colors.textCaptionGrayscale}
                    />
                    <Text className="text-textTitleGrayscale ml-2 pb-3 text-sm">
                      Acesso a comunidade do curso
                    </Text>
                  </View>
                  <View className="flex-row">
                    <MaterialIcons
                      name="phonelink"
                      size={24}
                      color={colors.textCaptionGrayscale}
                    />
                    <Text className="text-textTitleGrayscale ml-2 pb-3 text-sm">
                      Assista onde e quando quiser!
                    </Text>
                  </View>
                </View>
                <View className="mt-10">
                  {subscribed ? (
                    <AccessCourseButton course={course} />
                  ) : (
                    <SubscriptionButton course={course} />
                  )}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  transparentBackground: {
    flex: 1,
    backgroundColor: "rgba(250, 254, 255, 0.5)", // Semi-transparent background
    justifyContent: "flex-end", // Align the modal to the bottom
  },
  modalView: {
    height: "90%",
    width: "100%",
    backgroundColor: colors.surfaceSubtleCyan,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

ExploreCard.propTypes = {
  course: PropTypes.object,
  isPublished: PropTypes.bool,
  subscribed: PropTypes.bool,
};
