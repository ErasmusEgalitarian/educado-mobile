import { View, Text, StyleSheet } from "react-native";
import Sections from "@/constants/preview-sections";
import Slick from "react-native-slick";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";

export const WelcomeSlider = () => {
  return (
    <Slick
      scrollEnabled={true}
      loop={true}
      index={0}
      dotColor={colors.surfaceSubtleGrayscale}
      dotStyle={styles.dot}
      activeDotColor={colors.textLabelCyan}
      activeDotStyle={styles.dot}
      height={310}
      showsButtons={true}
      autoplayTimeout={10}
      autoplay={true}
      nextButton={<MaterialCommunityIcons name="chevron-right" size={24} />}
      prevButton={<MaterialCommunityIcons name="chevron-left" size={24} />}
    >
      {Sections.map((sections, index) => (
        <View key={index} className="px-10">
          <Text className="px-8 text-center text-h2-sm-regular">
            {sections.title}
          </Text>
          <Text className="px-12 pt-8 text-center text-body-regular">
            {sections.description}
          </Text>
        </View>
      ))}
    </Slick>
  );
};

const styles = StyleSheet.create({
  dot: {
    width: 10,
    height: 10,
  },
});
