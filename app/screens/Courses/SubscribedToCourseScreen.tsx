import { View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StartNowButton } from "@/components/Courses/CourseSubsription/StartNowButton";
import { Course } from "@/types";
import { t } from "@/i18n";
import SubscribedImage from "@/assets/images/subscribe.png";

export interface SubscribedToCourseScreenProps {
  route: {
    params: {
      course: Course;
    };
  };
}

const SubscribedToCourseScreen = ({ route }: SubscribedToCourseScreenProps) => {
  const course = route.params.course;

  return (
    <SafeAreaView className="flex h-screen w-screen flex-col items-center justify-center bg-surfaceSubtleCyan">
      <View className="fixed -right-2 -top-24 h-[400] w-[430] rounded-r-[500] bg-surfaceDarkerCyan" />

      <View className="flex h-1/2 w-full items-center justify-end">
        <Image
          className="h-4/6 w-2/5 object-scale-down"
          source={SubscribedImage}
        />
        <View className="flex items-center py-4">
          <Text className="text-textLabelCyan text-h1-sm-bold">
            {t("course.congratulations")}
          </Text>
          <Text className="text-textLabelCyan text-h2-sm-bold">
            {t("course.begin-journey")}
          </Text>
        </View>
        <StartNowButton course={course} />
      </View>

      <View className="fixed -bottom-14 -left-2 h-[400] w-[430] rounded-l-[500] bg-surfaceLighterCyan" />
    </SafeAreaView>
  );
};

export default SubscribedToCourseScreen;
