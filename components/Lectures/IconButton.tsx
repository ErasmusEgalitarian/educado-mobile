import tailwindConfig from "../../tailwind.config.js";
import PropTypes from "prop-types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

export default function IconButton({
  size = 24,
  icon = "menu",
  onClick,
  pressed = false,
}) {
  return (
    <Pressable onPress={onClick}>
      <View
        className={
          pressed
            ? "h-[10vw] w-[10vw] flex-col items-center justify-center rounded-full bg-projectWhite active:bg-opacity-50"
            : "h-[10vw] w-[10vw] flex-col items-center justify-center rounded-full bg-primary_custom active:bg-opacity-50"
        }
      >
        <MaterialCommunityIcons
          name={icon}
          size={size}
          color={
            pressed
              ? tailwindConfig.theme.colors.primary_custom
              : tailwindConfig.theme.colors.projectWhite
          }
        />
      </View>
    </Pressable>
  );
}

IconButton.propTypes = {
  size: PropTypes.number,
  icon: PropTypes.string,
  onClick: PropTypes.func,
  pressed: PropTypes.bool,
};
