import { View, Image } from "react-native";
import Text from "@/components/General/Text";

/**
 * Custom header component with an icon and title.
 * @param {string} title - The title to display next to the icon.
 * @returns {JSX.Element} The IconHeader component.
 */
export interface IconHeaderProps {
  title: string;
  description?: string;
}

const IconHeader = ({ title, description }: IconHeaderProps) => {
  return (
    <>
      <View className="flex flex-row items-center pb-2">
        <Image
          source={require("../../assets/images/singleIcon.png")}
          alt="Icon"
          className="mr-4 h-7 w-7"
        />
        <Text className="font-montserrat text-[24px] font-montserrat-bold leading-[24px] tracking-[0px]">
          {title}
        </Text>
      </View>
    </>
  );
};

export default IconHeader;
