import { View, Text, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { MaterialCommunityIcons } from "@expo/vector-icons";

/**
 * Renders a button component for continuing a section.
 * @param {Function} onPress - The function to be called when the button is pressed.
 * @returns {JSX.Element} - The rendered component.
 */
const ContinueSectionButton = ({ onPress }) => {
  ContinueSectionButton.propTypes = {
    onPress: PropTypes.func.isRequired,
  };

  return (
    <View className="h-[70] w-[100%] self-center">
      <TouchableOpacity
        className="flex w-[100%] rounded-lg bg-bgprimary_custom"
        onPress={onPress}
      >
        <View className="flex-row items-center justify-center p-4">
          <Text className="mr-2 font-montserrat-bold text-xl text-projectWhite">
            Começar curso
          </Text>
          <MaterialCommunityIcons
            testID="play-circle-outline"
            name="play-circle-outline"
            size={32}
            color="white"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ContinueSectionButton;
