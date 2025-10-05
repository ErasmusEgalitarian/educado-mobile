import * as Utility from "../../services/utils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity } from "react-native";
import CardLabel from "../Explore/CardLabel";
import PropTypes from "prop-types";

const CertificateOverlay = ({ certificate, handleVisualizarClick }) => {
  const {
    courseName,
    courseCategory,
    estimatedCourseDuration,
    dateOfCompletion,
  } = certificate;

  return (
    <View className="absolute bottom-0 left-0 right-0 h-1/2 rounded-lg bg-projectWhite px-2 opacity-95">
      <View className="relative mx-4 flex-col">
        <Text className="text-black mt-2 text-lg font-medium">
          {courseName}
        </Text>
        <View className="border-gray h-1 w-full border-b-[1px] pt-1 opacity-20"></View>
        <View className="bg-gray-500 h-[0.5] w-full pt-2 opacity-50" />
        <View className="w-full flex-row items-start justify-between">
          <View className="flex-col items-start justify-between">
            <View className="flex-row flex-wrap items-center justify-start pb-2">
              <CardLabel
                title={Utility.determineCategory(courseCategory)}
                icon={Utility.determineIcon(courseCategory)}
              />
              <View className="w-2.5" />
              <CardLabel
                title={Utility.formatHours(estimatedCourseDuration)}
                icon={"clock-outline"}
              />
              <View className="w-2.5" />
              <CardLabel
                title={Utility.formatDate(dateOfCompletion)}
                icon={"calendar-check"}
              />
            </View>
          </View>
        </View>
      </View>
      <TouchableOpacity
        className="absolute bottom-0 right-0 m-6 flex items-center"
        onPress={handleVisualizarClick}
      >
        <View className="mt-2 flex flex-row items-center justify-center">
          <Text className="mr-1 font-bold text-primary_custom">visualizar</Text>
          <MaterialCommunityIcons name={"eye"} size={13} color={"#166276"} />
        </View>
        <View className="w-[90px] border-b-[1px] border-primary_custom pt-[2px]"></View>
      </TouchableOpacity>
    </View>
  );
};
CertificateOverlay.propTypes = {
  certificate: PropTypes.shape({
    courseName: PropTypes.string.isRequired,
    courseCategory: PropTypes.string.isRequired,
    estimatedCourseDuration: PropTypes.number.isRequired,
    dateOfCompletion: PropTypes.string,
  }).isRequired,
  handleVisualizarClick: PropTypes.func.isRequired,
};

export default CertificateOverlay;
