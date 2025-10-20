import { View, Image, Text } from "react-native";

type Props = {
  title?: string;
  description?: string;
};

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
        <Image
          source={require("../../assets/images/singleIcon.png")}
          alt="Icon"
          className="mr-4 h-7 w-7"
        />
        <Text className="text-h2-sm-medium text-textTitleGrayscale">
          {title}
        </Text>
      </View>
      <Text className="text-h2-sm-medium px-6 pb-4 pl-6 text-sm">
        {description}
      </Text>
    </>
  );
};
export default IconHeader;
