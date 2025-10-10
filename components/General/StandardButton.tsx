import { TouchableOpacity } from "react-native";
import Text from "./Text";
import PropTypes from "prop-types";

/* A standard button for continue */

export default function StandardButton({ props }) {
  const { onPress, buttonText } = props;
  return (
    <TouchableOpacity
      className="rounded-lg bg-primary_custom px-10 py-4"
      onPress={onPress}
    >
      <Text className="font-sans-bold text-center text-lg text-projectWhite">
        {buttonText}
      </Text>
    </TouchableOpacity>
  );
}

StandardButton.propTypes = {
  onPress: PropTypes.func,
  buttonText: PropTypes.string,
  props: PropTypes.object,
};
