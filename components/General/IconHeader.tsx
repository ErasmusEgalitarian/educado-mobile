import { View, Image, Text } from "react-native";
import iconSource from "@/assets/images/singleIcon.png";

interface Props {
  title?: string;
  description?: string;
}

/**
 * Custom header component with an icon and title.
 * @param {string} title - The title to display next to the icon.
 * @param {description} - Optional description below header
 * @returns {JSX.Element} The IconHeader component.
 */
const IconHeader = ({ title, description }: Props) => {
  return (
    <>
      <View className="flex flex-row items-center pb-2">
        <Image source={iconSource} alt="Icon" className="mr-4 h-7 w-7" />
        <Text className="text-textTitleGrayscale text-h2-sm-bold">{title}</Text>
      </View>
    </>
  );
};
export default IconHeader;
