import { View, Pressable } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Text from '../../../components/general/Text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomProgressBar from '../../exercise/Progressbar';
import tailwindConfig from '../../../tailwind.config';
import { determineIcon, determineCategory, formatHours, checkProgressCourse} from '../../../services/utilityFunctions';
import PropTypes from 'prop-types';
import { checkCourseStoredLocally } from '../../../services/StorageService';

/**
 * CourseCard component displays a card for a course with its details
 * @param {Object} props - Component props
 * @param {Object} props.course - Course object containing course details
 * @returns {JSX.Element} - Rendered component
 */
export default function CourseCard({ course, isOnline}) {
	const [downloaded, setDownloaded] = useState(false);
	const navigation = useNavigation();
	const [studentProgress, setStudentProgress] = useState([0,0,0]);


	const checkDownload = async () => {
		setDownloaded(await checkCourseStoredLocally(course.courseId));
	};
	checkDownload();

	const checkProgress = async () => {
		const progress = await checkProgressCourse(course.courseId);
		setStudentProgress(progress);
	}; checkProgress();

	const enabledUI = 'bg-projectWhite m-[3%] rounded-lg elevation-[4] mx-[5%] p-[5%]';

	const disabledUI = 'opacity-50 bg-projectWhite m-[3%] rounded-lg shadow-sm shadow-opacity-[0.3] elevation-[8] mx-[5%] p-[5%]';

	const layout = downloaded || isOnline ? enabledUI : disabledUI;

	return (
		<Pressable
			testID="courseCard"
			className={layout}
			style={{
				backgroundColor: 'white',
				borderRadius: 8,
				elevation: 4,
				shadowColor: '#28363E',
			}}
			onPress={() => { layout === enabledUI ?
				navigation.navigate('Section', {
					course: course,
				}) : null;
			}}
		>
			<View>
				<View className="flex-row items-start justify-between px-[1%] py-[1%]">
					<Text className="text-[18px] text-projectBlack flex-1 self-center font-montserrat-semi-bold">
						{course.title ? course.title : 'Título do curso'}
					</Text>
				
				</View>
				<View className="h-[1] bg-disable m-[2%]" />
				<View className="flex-col items-start justify-start">
					<View className="flex-row items-center">
						<MaterialCommunityIcons size={18} name={determineIcon(course.category)} color={tailwindConfig.theme.colors.graytext}></MaterialCommunityIcons>
						<Text className="mx-[2.5%] my-[3%]">{determineCategory(course.category)}</Text>
					</View>
					<View className="flex-row items-center">
						<MaterialCommunityIcons size={18} name="clock" color={tailwindConfig.theme.colors.graytext}></MaterialCommunityIcons>
						<Text className="mx-[2.5%] my-[3%]">{course.estimatedHours ? formatHours(course.estimatedHours) : 'duração'}</Text>
					</View>
				</View>
				<View className="flex-row items-center">
					<CustomProgressBar width={56} progress={studentProgress} height={1} />
					<Pressable className="z-[1]"
						onPress={() => {layout === enabledUI ?
							navigation.navigate('Section', {
								course: course,
							}) : null;
						}}
					>
						<MaterialCommunityIcons
							name="chevron-right"
							size={18}
							color={tailwindConfig.theme.colors.primary}/>
					</Pressable>
				</View>
			</View>
		</Pressable>
	);
}

CourseCard.propTypes = {
	course: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.array,
	]),
	isOnline: PropTypes.bool
};

