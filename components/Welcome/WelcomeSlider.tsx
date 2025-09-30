import { useRef } from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import Sections from "../../constants/preview-sections";
import Slick from "react-native-slick";
import Text from "../General/Text";

export default function WelcomeSlider() {
  const slick = useRef(null);
  const tailwindConfig = require("../../tailwind.config.js");
  const projectColors = tailwindConfig.theme.colors;

  return (
    <Slick
      ref={slick}
      scrollEnabled={true}
      loop={false}
      index={0}
      dotColor={projectColors.projectWhite}
      dotStyle={{ width: 10, height: 10 }}
      activeDotColor={projectColors.primary_custom}
      activeDotStyle={{ width: 10, height: 10 }}
      height={265}
      showsButtons={true}
      autoplayTimeout={10}
      autoplay={true}
      nextButton={
        <Svg className="mr-4 h-[25px] w-[25px]">
          <Path
            d="M8.59003 17.1239L13.17 12.5439L8.59003 7.95385L10 6.54385L16 12.5439L10 18.5439L8.59003 17.1239Z"
            fill={projectColors.projectBlack}
          />
        </Svg>
      }
      prevButton={
        <Svg className="ml-4 h-[25px] w-[25px]">
          <Path
            d="M15.41 17.1239L10.83 12.5439L15.41 7.95385L14 6.54385L8 12.5439L14 18.5439L15.41 17.1239Z"
            fill={projectColors.projectBlack}
          />
        </Svg>
      }
    >
      {Sections.map((sections, index) => (
        <View key={index} className="relative h-full items-center px-10">
          <View className="top-0 px-4">
            <Text className="text-center font-sans-bold text-subheading">
              {sections.title}
            </Text>
          </View>

          <View className="absolute bottom-0 px-6 pb-[27.5%]">
            <Text className="text-center text-body">
              {sections.description}
            </Text>
          </View>
        </View>
      ))}
    </Slick>
  );
}
