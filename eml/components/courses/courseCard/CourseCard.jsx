import { View, Pressable, ImageBackground } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import Text from '../../../components/general/Text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomProgressBar from '../../exercise/Progressbar';
import tailwindConfig from '../../../tailwind.config';
import { determineIcon, determineCategory, formatHours, checkProgressCourse} from '../../../services/utilityFunctions';
import DownloadCourseButton from './DownloadCourseButton';
import PropTypes from 'prop-types';
import { checkCourseStoredLocally } from '../../../services/StorageService';
import { getBucketImage } from '../../../api/api';

/**
 * CourseCard component displays a card for a course with its details
 * @param {Object} props - Component props
 * @param {Object} props.course - Course object containing course details
 * @returns {JSX.Element} - Rendered component
 */
export default function CourseCard({ course, isOnline}) {
	const [downloaded, setDownloaded] = useState(false);
	const navigation = useNavigation();
	const [studentProgress, setStudentProgress] = useState(0);
	const [coverImage, setCoverImage] = useState(null);
	const [hasError, setHasError] = useState(false);
	const prevCourseId = useRef(null);


	// Check if course is downloaded locally
	useEffect(() => {
		const checkDownload = async () => {
			try {
				const isDownloaded = await checkCourseStoredLocally(course.courseId);
				setDownloaded(isDownloaded);
			} catch (error) {
				console.error('Error checking download status:', error);
				setDownloaded(false);
				setHasError(true);
			}
		};
		checkDownload();
	}, [course.courseId]);

	// Check student progress
	useEffect(() => {
		const checkProgress = async () => {
			try {
				const progress = await checkProgressCourse(course.courseId);
				setStudentProgress(progress || 0);
			} catch (error) {
				console.error('Error checking progress:', error);
				setStudentProgress(0);
				setHasError(true);
			} finally {
				setDataLoading(false);
			}
		};
		checkProgress();
	}, [course.courseId]);

	useEffect(() => {
		const fetchImage = async () => {
			try {
				const image = await getBucketImage(course.courseId + '_c');
				if (typeof image === 'string') {
					setCoverImage(image);
				} else {
					throw new Error();
				}
			} catch (error) {
				console.log(error);
			}
		};

		if (course !== null && course.courseId !== prevCourseId.current) {
			setCoverImage(null); // Reset coverImage state
			fetchImage();
			prevCourseId.current = course.courseId;

		}
	}, [course]);

	const enabledUI = 'bg-projectWhite rounded-lg elevation-[3] m-[3%] mx-[5%] overflow-hidden';
	const disabledUI = 'opacity-50 bg-projectWhite rounded-lg elevation-[3] m-[3%] mx-[5%] overflow-hidden';

	const layout = downloaded || isOnline ? enabledUI : disabledUI;
	const isDisabled = layout === disabledUI;

	// Safe navigation handler
	const handleNavigation = () => {
		if (layout === enabledUI && course?.courseId) {
			try {
				navigation.navigate('CourseOverview', { course: course });
			} catch (error) {
				console.error('Navigation error:', error);
			}
		}
	};

	// Render loading state
	if (dataLoading) {
		return (
			<View className={enabledUI}>
				<View className="p-[5%] h-[200px] justify-center items-center">
					<MaterialCommunityIcons 
						name="loading" 
						size={24} 
						color="gray" 
					/>
					<Text className="text-gray-500 font-montserrat mt-2">
						Carregando curso...
					</Text>
				</View>
			</View>
		);
	}

	return (
		<Pressable 
			testID="courseCard"
			className={layout}
			onPress={handleNavigation}
		>
			<View>
				<ImageBackground source={{uri: coverImage}}>
					{coverImage && <View className="rounded-lg" style={{height:110}}/> }
					<View className="relative">
						<View className="absolute top-0 left-0 right-0 bottom-0 bg-projectWhite opacity-95" />
						<View className="p-[5%]">
							<View className="flex flex-col">
								<View className="flex-row items-start justify-between px-[1%] py-[1%]">
									<Text className="text-[18px] text-projectBlack flex-1 self-center font-montserrat-semi-bold">
										{course?.title || 'Título do curso'}
									</Text>
									<View className="flex-row items-center">
										<DownloadCourseButton 
											course={course} 
											disabled={isDisabled}
										/>
									</View>
								</View>
							</View>
							
							<View className="h-[1] bg-disable m-[2%]" />
							
							<View className="flex-row flex-wrap items-center justify-start">
								<View className="flex-row items-center">
									<MaterialCommunityIcons 
										size={18} 
										name={determineIcon(course?.category)} 
										color="gray"
									/>
									<Text className="mx-[2.5%] my-[3%]">
										{determineCategory(course?.category)}
									</Text>
								</View>
								<View className="flex-row items-center">
									<MaterialCommunityIcons 
										size={18} 
										name="clock" 
										color="gray"
									/>
									<Text className="mx-[2.5%] my-[3%]">
										{course?.estimatedHours 
											? formatHours(course.estimatedHours) 
											: 'Duração não informada'
										}
									</Text>
								</View>
							</View>
							
							<View className="flex-row items-center">
								<CustomProgressBar 
									width={56} 
									progress={studentProgress} 
									height={1} 
								/>
								<Pressable 
									className="z-[1]"
									onPress={handleNavigation}
								>
									<MaterialCommunityIcons 
										size={28} 
										name="play-circle" 
										color={tailwindConfig.theme.colors.primary_custom}
									/>
								</Pressable>
							</View>
							
							{/* Error indicator */}
							{hasError && (
								<View className="mt-2 flex-row items-center">
									<MaterialCommunityIcons 
										name="alert-circle-outline" 
										size={16} 
										color="orange" 
									/>
									<Text className="text-xs text-orange-500 ml-1">
										Alguns dados podem estar desatualizados
									</Text>
								</View>
							)}
						</View>
					</View>
				</ImageBackground>
			</View>
		</Pressable>
	);
}

CourseCard.propTypes = {
	course: PropTypes.shape({
		courseId: PropTypes.string.isRequired,
		title: PropTypes.string,
		category: PropTypes.string,
		estimatedHours: PropTypes.number,
	}),
	isOnline: PropTypes.bool
};

CourseCard.defaultProps = {
	course: null,
	isOnline: false
};

