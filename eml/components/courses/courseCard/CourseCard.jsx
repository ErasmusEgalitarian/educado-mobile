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
	const [imageLoading, setImageLoading] = useState(true);
	const [imageError, setImageError] = useState(false);
	const prevCourseId = useRef(null);


	const checkDownload = async () => {
		setDownloaded(await checkCourseStoredLocally(course.courseId));
	};
	checkDownload();

	const checkProgress = async () => {
		const progress = await checkProgressCourse(course.courseId);
		setStudentProgress(progress);
	}; checkProgress();

	useEffect(() => {
		const fetchImage = async () => {
			if (!course?.courseId) return;
			
			setImageLoading(true);
			setImageError(false);
			
			try {
				const image = await getBucketImage(course.courseId + '_c');
				if (typeof image === 'string' && image.startsWith('data:image/')) {
					setCoverImage(image);
					setImageError(false);
				} else {
					throw new Error('Invalid image format received');
				}
			} catch (error) {
				console.error('Error fetching cover image:', error);
				setCoverImage(null);
				setImageError(true);
			} finally {
				setImageLoading(false);
			}
		};

		if (course !== null && course.courseId !== prevCourseId.current) {
			setCoverImage(null);
			fetchImage();
			prevCourseId.current = course.courseId;
		}
	}, [course]);

	const enabledUI = 'bg-projectWhite rounded-lg elevation-[3] m-[3%] mx-[5%] overflow-hidden';
	const disabledUI = 'opacity-50 bg-projectWhite rounded-lg elevation-[3] m-[3%] mx-[5%] overflow-hidden';

	const layout = downloaded || isOnline ? enabledUI : disabledUI;

	let isDisabled = layout === disabledUI;

	return (
		<Pressable testID="courseCard"
			className={layout}
			onPress={() => layout === enabledUI ?
				navigation.navigate('CourseOverview', {
					course: course,
				}) : null}
		>
			<View>
				<ImageBackground 
					source={
						coverImage 
							? { uri: coverImage }
							: require('../../../assets/images/sectionThumbnail.png')
					}
					style={{ minHeight: coverImage || imageLoading ? 110 : 0 }}
					resizeMode="cover"
				>
					{/* Image loading indicator */}
					{imageLoading && (
						<View className="h-[110px] justify-center items-center bg-gray-100">
							<MaterialCommunityIcons 
								name="loading" 
								size={20} 
								color="gray" 
							/>
						</View>
					)}
					
					{/* Image error indicator */}
					{imageError && !imageLoading && !coverImage && (
						<View className="h-[110px] justify-center items-center bg-gray-100">
							<MaterialCommunityIcons 
								name="image-off" 
								size={24} 
								color="gray" 
							/>
							<Text className="text-xs text-gray-500 mt-1">
								Imagem indisponível
							</Text>
						</View>
					)}

					{/* Main content overlay */}
					{(!imageLoading || coverImage) && (
						<View className="rounded-lg" style={{ height: 110 }} />
					)}
					
					<View className="relative">
						<View className="absolute top-0 left-0 right-0 bottom-0 bg-projectWhite opacity-95" />
						<View className="p-[5%]">
							<View className="flex flex-col">
								<View className="flex-row items-start justify-between px-[1%] py-[1%]">
									<Text className="text-[18px] text-projectBlack flex-1 self-center font-montserrat-semi-bold">
										{course.title ? course.title : 'Título do curso'}
									</Text>
									<View className="flex-row items-center">
										<DownloadCourseButton course={course} disabled={isDisabled}/>
									</View>
								</View>
							</View>
							<View className="h-[1] bg-disable m-[2%]" />
							<View className="flex-row flex-wrap items-center justify-start">
								<View className="flex-row items-center">
									<MaterialCommunityIcons size={18} name={determineIcon(course.category)} color={'gray'}></MaterialCommunityIcons>
									<Text className="mx-[2.5%] my-[3%]">{determineCategory(course.category)}</Text>
								</View>
								<View className="flex-row items-center">
									<MaterialCommunityIcons size={18} name="clock" color={'gray'}></MaterialCommunityIcons>
									<Text className="mx-[2.5%] my-[3%]">{course.estimatedHours ? formatHours(course.estimatedHours) : 'duração'}</Text>
								</View>
							</View>
							<View className="flex-row items-center">
								<CustomProgressBar width={56} progress={studentProgress} height={1} />
								<Pressable className="z-[1]"
									onPress={() => {layout === enabledUI ?
										navigation.navigate('CourseOverview', {
											course: course,
										}) : null;
									}}
								>
									<MaterialCommunityIcons size={28} name="play-circle" color={tailwindConfig.theme.colors.primary_custom}></MaterialCommunityIcons>
								</Pressable>
							</View>
						</View>
					</View>
				</ImageBackground>
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

