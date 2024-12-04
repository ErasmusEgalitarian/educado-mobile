import React from 'react';
import { View } from 'react-native';
import Text from '../general/Text';
import PropTypes from 'prop-types';

/* 
Description:	Displays the course title and section title of the exercise the student is in.
Denpendencies: 	The student must be in a exercise.
Props: 			courseTitle - The title of the course the student is in.
				sectionTitle - The title of the section the student is in.
*/

const ExerciseInfo = ({ courseTitle, sectionTitle }) => {
	return (
		<View className="items-start px-6 absolute bottom-10 z-10">
			<Text className="font-sans text-caption-small text-projectGray">
        Course name: {courseTitle}
			</Text>
			<Text className="font-sans-bold text-body text-projectBlack">{sectionTitle}</Text>
		</View>
	);
};

ExerciseInfo.propTypes = {
	courseTitle: PropTypes.string,
	sectionTitle: PropTypes.string,
};

export default ExerciseInfo;
