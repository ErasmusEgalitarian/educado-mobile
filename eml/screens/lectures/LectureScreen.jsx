// LectureScreen.js

import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import VideoLectureScreen from './VideoLectureScreen';
import TextImageLectureScreen from './TextImageLectureScreen';
import PropTypes from 'prop-types';
import Text from '../../components/general/Text';

const LectureScreen = ({ lectureObject, courseObject, isLastSlide, onContinue, handleStudyStreak }) => {
	const [course, setCourse] = useState(courseObject);
	const [lecture, setLecture] = useState(lectureObject);

	useEffect(() => {
		setLecture(lectureObject);
		setCourse(courseObject);
	}, [lectureObject, courseObject]);

	return (
		<View className="flex-1 bg-projectWhite">
			{lecture && course ? (
				<View className="flex-1 flex-col ">
					{lecture.video ? (
						<VideoLectureScreen
							lectureObject={lecture}
							courseObject={course}
							isLastSlide={isLastSlide}
							onContinue={onContinue}
							handleStudyStreak={handleStudyStreak}
						/>
					) : (
						<TextImageLectureScreen
							lectureObject={lecture}
							courseObject={course}
							isLastSlide={isLastSlide}
							onContinue={onContinue}
							handleStudyStreak={handleStudyStreak}
						/>
					)}
				</View>
			) : (
				<View className="w-full h-full items-center justify-center align-middle">
					<Text className="text-[25px] font-bold ml-[10]">Loading...</Text>
				</View>
			)}
		</View>
	);
};

LectureScreen.propTypes = {
	lectureObject: PropTypes.object.isRequired,
	courseObject: PropTypes.object.isRequired,
	isLastSlide: PropTypes.bool.isRequired,
	onContinue: PropTypes.func.isRequired,
	handleStudyStreak: PropTypes.func.isRequired
};

export default LectureScreen;
