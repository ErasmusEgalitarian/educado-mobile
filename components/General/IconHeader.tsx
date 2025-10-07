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
  };
  return (
    <>
      <View className="flex flex-row items-center pb-2 pl-6 pt-[20%]">
        <Image
          source={require("../../assets/images/singleIcon.png")}
          alt="Icon"
          className="mr-4 h-7 w-7"
        />
        <Text className="font-montserrat text-[24px] font-bold leading-[24px] tracking-[0px]">
          {title}
        </Text>
      </View>
    </>
  );
}
