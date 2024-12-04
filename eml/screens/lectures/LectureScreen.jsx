import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import VideoLectureScreen from './VideoLectureScreen';
import TextImageLectureScreen from './TextImageLectureScreen';
import PropTypes from 'prop-types';
import Text from '../../components/general/Text';

export default function LectureScreen({ lectureObject, courseObject, currentIndex, indexCount }) {

	const [course, setCourse] = useState(courseObject);
	const [lecture, setLecture] = useState(lectureObject);
	const isLastSlide = currentIndex === indexCount - 1;
  
	useEffect(() => {
		setLecture(lectureObject);
		setCourse(courseObject);
	}, []);

	//Safe area should not be used if we want to use the full screen
	return (
		<View className="flex-1 bg-projectWhite">

			{lecture && course ?
				<View className="w-full h-full flex-col justify-center items-center">

					{lecture.contentType === "video" ?
						<VideoLectureScreen lectureObject={lecture} courseObject={course} isLastSlide={isLastSlide} />
						:
						<TextImageLectureScreen lectureObject={lecture} courseObject={course} isLastSlide={isLastSlide} />
					}
          
				</View>
				:
				<View className="w-full h-full items-center justify-center align-middle">
					<Text className="text-[25px] font-bold ml-[10]">loading...</Text>
				</View>

			}
		</View>
	);
}

LectureScreen.propTypes = {
	lectureObject: PropTypes.object,
	courseObject: PropTypes.object,
	currentIndex: PropTypes.number,
	indexCount: PropTypes.number,
};