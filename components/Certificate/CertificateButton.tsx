import { View, Pressable, Text } from "react-native";
import PropTypes from "prop-types";

/**
 * CertificateBtn component displays a button for certificates
 * @param buttonText - Text displayed in button
 * @param onPress - Function to be executed when button is pressed
 * @returns {JSX.Element} - Rendered component
 */
export default function CertificateButton({ buttonText, onPress }) {
  return (
    <View className="">
      <Pressable
        onPress={onPress}
        className="flex w-full items-center justify-center rounded-lg bg-primary_custom p-2"
      >
        <Text className="px-2 py-1 font-bold text-projectWhite">
          {buttonText}
        </Text>
      </Pressable>
    </View>
  );
}

CertificateButton.propTypes = {
  buttonText: PropTypes.string,
  onPress: PropTypes.func,
};
