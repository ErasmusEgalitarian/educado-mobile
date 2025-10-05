import { View, Pressable, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import PropTypes from "prop-types";

const StartNowButton = ({ course }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("CourseOverview", {
      course: course,
    });
  };

  return (
    <View className="flex items-center justify-center">
      <Pressable
        onPress={handlePress}
        className="flex w-80 items-center justify-center rounded-lg bg-primary_custom p-4"
      >
        <Text className="p-1 text-lg font-bold text-projectWhite">
          Começar agora
        </Text>
      </Pressable>
    </View>
  );
};

StartNowButton.propTypes = {
  course: PropTypes.object,
};

export default StartNowButton;
