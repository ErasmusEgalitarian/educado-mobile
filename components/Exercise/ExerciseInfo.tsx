import { View } from "react-native";
import Text from "../General/Text";
import PropTypes from "prop-types";

/*
Description:	Displays the course title and section title of the exercise the student is in.
Dependencies: 	The student must be in an exercise.
Props: 			courseTitle - The title of the course the student is in.
				sectionTitle - The title of the section the student is in.
*/

const ExerciseInfo = ({ courseTitle, sectionTitle }) => {
  return (
    <View className="z-10 mt-20 items-center px-6">
      <Text className="text-caption-body text-center font-sans text-projectGray">
        Course name: {courseTitle}
      </Text>
      <Text className="text-center font-sans-bold text-lg text-projectBlack">
        {sectionTitle}
      </Text>
    </View>
  );
};

ExerciseInfo.propTypes = {
  courseTitle: PropTypes.string.isRequired,
  sectionTitle: PropTypes.string.isRequired,
};

export default ExerciseInfo;
