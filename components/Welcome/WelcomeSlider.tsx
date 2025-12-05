import { useRef } from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { sections } from "@/constants/preview-sections";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";

const width = Dimensions.get("window").width;

const styles = {
  container: { gap: 5, marginTop: 10 },
  dot: { backgroundColor: colors.surfaceSubtleGrayscale, borderRadius: 50 },
  activeDot: { backgroundColor: colors.textLabelCyan, borderRadius: 50 },
};

export const WelcomeSlider = () => {
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <View className="flex">
      <Carousel
        ref={ref}
        width={width}
        height={width / 2}
        data={sections}
        onProgressChange={progress}
        loop
        autoPlay
        autoPlayInterval={10000}
        renderItem={({ item }) => (
          <View className="h-full flex-row items-center justify-center px-10">
            <Pressable
              onPress={() => {
                ref.current?.prev();
              }}
            >
              <MaterialCommunityIcons name="chevron-left" size={24} />
            </Pressable>
            <View className="flex-col">
              <Text className="px-8 text-center text-h2-sm-regular">
                {item.title}
              </Text>
              <Text className="px-12 pt-8 text-center text-body-regular">
                {item.description}
              </Text>
            </View>
            <Pressable
              onPress={() => {
                ref.current?.next();
              }}
            >
              <MaterialCommunityIcons name="chevron-right" size={24} />
            </Pressable>
          </View>
        )}
      />

      <View className="mt-8 flex">
        <Pagination.Basic
          progress={progress}
          data={sections}
          activeDotStyle={styles.activeDot}
          dotStyle={styles.dot}
          containerStyle={styles.container}
          onPress={onPressPagination}
        />
      </View>
    </View>
  );
};
