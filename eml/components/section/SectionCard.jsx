import React, { useState } from 'react';
import { View, Pressable, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Text from '../general/Text';
import Collapsible from 'react-native-collapsible';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';


/**
 * A component that displays a section card with collapsible content.
 * @param {Object} section - The section object containing the section data.
 * @param {Object} course - The course object containing the course data.
 * @param {Number} progress - The progress containing the student's progress.
 * @returns {JSX.Element} - The SectionCard component.
 */
export default function SectionCard({ section, course, progress }) {


	const navigation = useNavigation();
	const isComplete = progress === section.components.length;
	const inProgress = 0 < progress && progress < section.components.length;
	const notPossible = progress > section.components.length;
	const [isOpen, setIsOpen] = useState(false);
	const backgroundColor = isComplete ? 'bg-limeGreenDarker' : inProgress ? 'bg-cyanBlue' : notPossible ? 'bg-error' : {};

	/**
		 * Toggles the dropdown state.
		 */
	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};


	/**
		 * Handles the image press event.
		 */
	const handleImagePress = () => {
		navigation.navigate('Components', {
			section: section,
			parsedCourse: course,
		});
	};


	return (
		<View>
			<Pressable testID="collapsible" onPress={toggleDropdown} className="bg-projectWhite rounded-lg shadow-lg shadow-opacity-[0.3] mb-[15] mx-[18] overflow-hidden elevation-[8]">
				<View className={'flex-row items-center justify-between px-[25] py-[15] ' + backgroundColor}>
					<Text className="text-[16px] font-bold text-projectBlack flex-[1]">
						{section.title}
					</Text>
					<Text className="mr-[10] text-projectBlack">
						{/* completed */}
						{progress}/{section.components.length} concluídos
					</Text>
					<MaterialCommunityIcons
						testID={isOpen ? 'chevron-up' : 'chevron-down'}
						name={isOpen ? 'chevron-up' : 'chevron-down'}
						size={25}
						color="gray"
					/>
				</View>

				<Collapsible collapsed={!isOpen}>
					<View className="h-[1] bg-disable" />
					<Text className="mx-[20] my-[10]">{section.description}</Text>
					<View className="w-[100%]">
						<TouchableOpacity className="w-[100%] h-[300] items-center justify-center relative"
							onPress={handleImagePress}>
							<Image source={require('../../assets/images/sectionThumbnail.png')} className="w-[100%] h-[300] object-cover" />
							<View className="absolute z-[1]">
								<MaterialCommunityIcons name="play-circle-outline" size={100} color="lightblue" />
							</View>
						</TouchableOpacity>
					</View>
				</Collapsible>
			</Pressable>
		</View>
	);
}

SectionCard.propTypes = {
	section: PropTypes.object,
	course: PropTypes.object,
	progress: PropTypes.number,
};