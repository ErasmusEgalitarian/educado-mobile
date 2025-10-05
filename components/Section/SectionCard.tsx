import { View, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Text from "../General/Text";
import PropTypes from "prop-types";

/**
 * A component that displays a section card with collapsible content.
 * @param {Object} section - The section object containing the section data.
 * @param {Number} progress - The progress containing the student's progress.
 * @param {Function} onPress - The callback function to navigate
 * @returns {JSX.Element} - The SectionCard component.
 */
export default function SectionCard({ section, progress, onPress }) {
  const isComplete = progress === section.components.length;
  const inProgress = 0 < progress && progress < section.components.length;
  const progressText = isComplete
    ? "Concluído"
    : inProgress
      ? "Em progresso"
      : "Não iniciado";
  const progressTextColor = isComplete ? "text-success" : "text-projectBlack";

  return (
    <View>
      <TouchableOpacity
        className="shadow-opacity-[0.3] elevation-[8] mx-[18] mb-[15] overflow-hidden rounded-lg border-[1px] border-lightGray bg-secondary shadow-lg"
        onPress={onPress}
      >
        <View className="flex-row items-center justify-between px-[25] py-[15]">
          <View>
            <Text className="mb-2 font-montserrat-bold text-[16px] text-projectBlack">
              {section.title}
            </Text>

            <View className="flex-row items-center">
              <Text
                className={`font-montserrat text-[14px] ${progressTextColor}`}
              >
                {/* progress */}
                {progress}/{section.components.length} {progressText}
              </Text>
              <View className="ml-2">
                {isComplete && (
                  <MaterialCommunityIcons
                    testID={"check-circle"}
                    name={"check-circle"}
                    size={14}
                    color="green"
                  />
                )}
              </View>
            </View>
          </View>
          <MaterialCommunityIcons
            testID="chevron-right"
            name="chevron-right"
            size={25}
            color="gray"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

SectionCard.propTypes = {
  section: PropTypes.object,
  progress: PropTypes.number,
  onPress: PropTypes.func,
};
