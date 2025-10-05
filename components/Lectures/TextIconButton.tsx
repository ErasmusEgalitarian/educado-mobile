import PropTypes from "prop-types";

import { Pressable, View, Text } from "react-native";

export default function TextIconButton({
  text = "360",
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
        <Text
          className={
            pressed
              ? "text-sm font-semibold text-primary_custom"
              : "text-sm font-semibold text-projectWhite"
          }
        >
          {text}p
        </Text>
      </View>
    </Pressable>
  );
}

TextIconButton.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  pressed: PropTypes.bool,
};
