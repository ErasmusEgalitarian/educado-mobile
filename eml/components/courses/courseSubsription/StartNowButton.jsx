import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';


const StartNowButton = ({ course }) => {
	const navigation = useNavigation();

	const handlePress = () => {
		navigation.navigate('CourseOverview', {
			course: course
		});
	};

	return (
		<View className="flex justify-center items-center">
			<Pressable
				onPress={handlePress}
				className="w-80 flex items-center justify-center rounded-lg bg-primaryCustom p-4"
			>
				<Text className="text-projectWhite p-1 font-bold text-lg">
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