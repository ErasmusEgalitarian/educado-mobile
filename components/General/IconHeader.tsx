import { View, Image, Text } from "react-native";
import { colors } from "@/theme/colors";

type Props = {
  title?: string;
  description?: string;
};

/**
 * Custom header component with an icon and title.
 * @param {string} title - The title to display next to the icon.
 * @returns {JSX.Element} The IconHeader component.
 */
const IconHeader = ({ title, description }: Props) => {
  return (
    <>
      <View className="flex flex-row items-center pb-2 pl-6 pt-[20%]">
        <Image
          source={require("../../assets/images/singleIcon.png")}
          alt="Icon"
          className="mr-2 h-8 w-8"
        />
        <Text
          className="text-h2-sm-medium"
          style={{ color: colors.textTitleGrayscale }}
        >
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
