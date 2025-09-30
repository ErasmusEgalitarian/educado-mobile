import { View, TouchableOpacity } from "react-native";
import Text from "../General/Text";
import { Icon } from "@rneui/base";
import tailwindConfig from "../../tailwind.config.js";
import PropTypes from "prop-types";

/**
 * Component for profile navigation buttons on profile page
 * @param {Object} props should contain the following properties:
 * - label: String
 * - onPress: Function
 * @returns {React.Element} JSX element
 */
export default function ProfileNavigationButton(props) {
  const tailwindColors = tailwindConfig.theme.colors;

  ProfileNavigationButton.propTypes = {
    label: PropTypes.string,
    onPress: PropTypes.func,
    onClose: PropTypes.func,
  };

  return (
    <View>
      <TouchableOpacity
        className="w-full border-b border-lightGray py-5"
        onPress={props.onPress}
      >
        <View className="flex flex-row">
          <Text className="mt-0.5 flex-1 items-start text-lg">
            {props.label}
          </Text>
          <View className="items-end">
            <Icon
              size={25}
              name="chevron-right"
              type="material-community"
              color={tailwindColors.projectGray}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
