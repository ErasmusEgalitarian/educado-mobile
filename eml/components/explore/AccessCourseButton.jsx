import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';

/**
 * AccessCourseButton component displays a button to access a course
 * @param course - Course object containing course details
 * @returns {JSX.Element} - Rendered component
 */
const AccessCourseButton = ({ course }) => {

	const navigation = useNavigation();

	const handlePress = () => {
		navigation.navigate('Section', {
			course: course
		});
	};

	return (
		<View className="">
			<Pressable
				onPress={handlePress} // Assigning the empty function to the onPress prop
				className="w-full flex items-center justify-center rounded-lg bg-primary_custom p-2"
			>
				<Text className="text-projectWhite p-1 font-bold">
          Acessar curso
				</Text>
			</Pressable>
		</View>
	);
};

AccessCourseButton.propTypes = {
	course: PropTypes.object,
};

export default AccessCourseButton;
