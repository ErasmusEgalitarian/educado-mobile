import { View, Image } from "react-native";
import Text from "./Text";
import PropTypes from "prop-types";

/**
 * Custom header component with an icon and title.
 * @param {string} title - The title to display next to the icon.
 * @returns {JSX.Element} The IconHeader component.
 */
export default function IconHeader({ title, description }) {
  IconHeader.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
  };
  return (
    <>
      <View className="flex flex-row items-center pb-2 pl-6 pt-[20%]">
        <Image
          source={require("../../assets/images/singleIcon.png")}
          alt="Icon"
          className="mr-2 h-8 w-8"
        />
        <Text className="text-xl font-bold">{title}</Text>
      </View>
      <Text className="font-montserrat px-6 pb-4 pl-6 text-sm">
        {description}
      </Text>
    </>
  );
}
