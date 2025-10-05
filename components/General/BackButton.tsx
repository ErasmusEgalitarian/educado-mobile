import { Pressable } from "react-native";
import { Icon } from "@rneui/base";
import tailwindConfig from "../../tailwind.config.js";
import PropTypes from "prop-types";

/**
 * Component for navigating back.
 * > NOTE: Should be placed inside a component with `relative` positioning.
 *
 * @param {Object} props Properties:
 * - onPress: Function for navigating back
 * - style: Style for the button
 * @returns JSX element
 */
export default function BackButton(props) {
  BackButton.propTypes = {
    onPress: PropTypes.func,
    style: PropTypes.array,
  };

  return (
    <>
      <Pressable
        onPress={props.onPress}
        className="absolute z-50 -m-4 p-4"
        style={props.style ?? null}
      >
        <Icon
          size={25}
          name="chevron-left"
          type="material-community"
          color={tailwindConfig.theme.colors.projectBlack}
        />
      </Pressable>
    </>
  );
}
