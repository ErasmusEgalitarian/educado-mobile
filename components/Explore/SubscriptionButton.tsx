import { View, Pressable, Text } from "react-native";
import { subscribe, addCourseToStudent } from "../../services/storage-service";
import { useNavigation } from "@react-navigation/native";
import PropTypes from "prop-types";

/**
 * SubscriptionButton provides an interface for users to subscribe to a course.
 * Upon pressing the button, the user will be subscribed to the course and then navigated to the 'Section' page with the respective courseId.
 * @param course - The course object containing details of the course.
 * @returns {JSX.Element} - Returns a JSX element.
 */
const SubscriptionButton = ({ course }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    subscribe(course.courseId);
    addCourseToStudent(course.courseId);

    navigation.navigate("Subscribed", {
      course: course,
    });
  };

  return (
    <View className="">
      <Pressable
        onPress={handlePress}
        className="flex w-full items-center justify-center rounded-lg bg-primary_custom p-4"
      >
        <Text className="p-1 text-lg font-bold text-projectWhite">
          Inscrever-se agora
        </Text>
      </Pressable>
    </View>
  );
};

SubscriptionButton.propTypes = {
  course: PropTypes.object,
};

export default SubscriptionButton;
