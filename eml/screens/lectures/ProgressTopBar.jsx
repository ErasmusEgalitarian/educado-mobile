import React from 'react';
import { View, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import tailwindConfig from '../../tailwind.config';
import PropTypes from 'prop-types';
import CoursePoints from '../../components/exercise/CoursePoints';

const LectureType = {
	TEXT: 'text',
	VIDEO: 'video',
};

const ProgressTopBar = ({ courseObject, lectureType, components, currentIndex = '' }) => {
	const navigator = useNavigation();
	const chevronColor = lectureType === LectureType.VIDEO ? tailwindConfig.theme.colors.projectWhite : tailwindConfig.theme.colors.projectBlack;

	const createCorrectIcon = (_index, _currentIndex) => {

		//if lecture is completed show check
		if (_index < _currentIndex || components[_index].component?.completed ? true : false) {
			return (
				<View key={_index} className=" mx-1  w-4 h-4 rounded-full bg-primaryCustom flex-col justify-center items-center">
					<MaterialCommunityIcons name="check-bold" size={12} color={tailwindConfig.theme.colors.projectWhite} />
				</View>
			);
		}
		//if lecture is current indicate with circle
		else if (_index === _currentIndex) {
			return (
				<View key={_index} className=" mx-1  w-4 h-4 rounded-full bg-primaryCustom flex-col justify-center items-center opacity-50">
					{/* <MaterialCommunityIcons name={_index >= allLectures.length ? "check" : "check"} size={12} color={tailwindConfig.theme.colors.primary_custom} /> */}
				</View>
			);
		}
		//if lecture is not current or completed show empty circle
		else if (_index > _currentIndex) {
			return (
				<View key={_index} className=" mx-1  w-3 h-3 rounded-full bg-projectGray first-line:opacity-50 flex-col justify-center items-center">
					{/* <MaterialCommunityIcons name={_index >= allLectures.length ? "check" : "check"} size={12} color={tailwindConfig.theme.colors.secondary} /> */}
				</View>
			);
		}

		//if lecture is completed show check
		if (_index < _currentIndex || components[_index].completed) {
			return (
				<View key={_index} className=" mx-1  w-5 h-5 rounded-full bg-primaryCustom flex-col justify-center items-center">
					<MaterialCommunityIcons name="check-bold" size={12} color={tailwindConfig.theme.colors.projectWhite} />
				</View>
			);
		}
		//if lecture is current indicate with circle
		else if (_index === _currentIndex) {
			return (
				<View key={_index} className=" mx-1  w-5 h-5 rounded-full bg-primaryCustom flex-col justify-center items-center opacity-50">
					{/* <MaterialCommunityIcons name={_index >= allLectures.length ? "check" : "check"} size={12} color={tailwindConfig.theme.colors.primary_custom} /> */}
				</View>
			);
		}
		//if lecture is not current or completed show empty circle
		else if (_index > _currentIndex) {
			return (
				<View key={_index} className=" mx-1  w-5 h-5 rounded-full  bg-secondary flex-col justify-center items-center">
					<MaterialCommunityIcons name={_index >= components.length ? 'check' : 'check'} size={12} color={tailwindConfig.theme.colors.secondary} />
				</View>
			);
		}

	};

	return (
		<View className="flex-row w-full items-center pt-[15%] relative px-4">
			<View className="relative flex-grow justify-center items-center flex-row">
				<Pressable onPress={() => navigator.goBack()} className="">
					<MaterialCommunityIcons name="chevron-left" size={28} color={chevronColor} />
				</Pressable>
				<View className=" flex-grow  flex-row justify-center items-center py-2">
					{components.map((_lecture, _index) => (
						/* if lecture is completed show check, otherwise empty  */
						createCorrectIcon(_index, currentIndex)

					))}
				</View>
				{LectureType.TEXT === lectureType && (
					<>
						<CoursePoints courseId={courseObject.courseId} />
					</>
				)}
        
			</View>
		</View>
	);
};

ProgressTopBar.propTypes = {
	courseObject: PropTypes.object,
	lectureType: PropTypes.string,
	components: PropTypes.array,
	currentIndex: PropTypes.number,
};

export default ProgressTopBar;