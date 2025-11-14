import { View, SafeAreaView } from "react-native";
import LottieView from "lottie-react-native";
import Text from "../../components/General/Text";
import PropTypes from "prop-types";
import StartNowButton from "../../components/Courses/CourseSubsription/StartNowButton";
import StartLaterButton from "../../components/Courses/CourseSubsription/StartLaterButton";

export default function SubscribedToCourseScreen({ route }) {
  SubscribedToCourseScreen.propTypes = {
    route: PropTypes.object,
  };

  const { course } = route.params;

  return (
    <SafeAreaView className="flex h-screen w-screen flex-col items-center justify-center bg-secondary">
      <LottieView
        className="absolute top-8 z-10 w-full"
        source={require("../../assets/animations/subscribedToCourse.json")}
        autoPlay
      />

      <View className="z-20 flex h-3/4 w-full items-center justify-end px-6">
        <View className="mb-8 h-40 w-fit justify-center">
          <Text className="font-montserrat-bold bg-secondary text-center text-3xl text-heading text-primary_custom">
            Parabéns! Você está inscrito no curso &quot;{course.title}&quot;
          </Text>
        </View>
      </View>

      <View className="mt-10">
        <StartNowButton course={course} />
      </View>
      <View>
        <StartLaterButton />
      </View>
    </SafeAreaView>
  );
}
