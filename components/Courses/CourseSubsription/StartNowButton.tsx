import { View, Pressable, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Course } from "@/types";
import { t } from "@/i18n";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";

interface StartNowButtonProps {
  course: Course;
}

export const StartNowButton = ({ course }: StartNowButtonProps) => {
  const navigation = useNavigation();

  return (
    <View className="w-5/6 pt-6">
      <Pressable
        className="flex-row items-center justify-center rounded-2xl bg-surfaceDefaultCyan p-4"
        onPress={() => {
          // @ts-expect-error Will be refactored when we move to Expo Router
          navigation.navigate("CourseOverview", {
            course: course,
          });
        }}
      >
        <Text className="p-1 text-surfaceSubtleGrayscale text-h4-sm-bold">
          {t("course.get-started")}
        </Text>
        <MaterialCommunityIcons
          testID="play-circle-outline"
          name="play-circle-outline"
          size={20}
          color={colors.textNegativeGrayscale}
        />
      </Pressable>
    </View>
  );
};
