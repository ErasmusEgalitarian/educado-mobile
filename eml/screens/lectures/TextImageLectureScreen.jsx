// TextImageLectureScreen.js

import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { Icon } from '@rneui/themed';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Text from '../../components/general/Text';
import * as StorageService from '../../services/StorageService';
import { completeComponent, handleLastComponent } from '../../services/utilityFunctions';
import RenderHtml from 'react-native-render-html';

const TextImageLectureScreen = ({ lectureObject, courseObject, isLastSlide, onContinue, handleStudyStreak }) => {
	const [imageUrl, setImageUrl] = useState(null);
	const [paragraphs, setParagraphs] = useState(null);
	const [htmlContent, setHtmlContent] = useState(null);
	const navigation = useNavigation();

	const handleContinue = async () => {
		try {
			await completeComponent(lectureObject, courseObject.courseId, true);
			if (isLastSlide) {
				handleStudyStreak();
				handleLastComponent(lectureObject, courseObject, navigation);
			} else {
				onContinue();
			}
		} catch (error) {
			console.error('Error completing the component:', error);
		}
	};

	useEffect(() => {
		if (lectureObject.image) {
			getLectureImage();
		}
		if (isHtml(lectureObject.content)) {
			setHtmlContent(lectureObject.content);
		} else {
			splitText(lectureObject.content);
		}
	}, []);

	const isHtml = (content) => {
		const htmlRegex = /<\/?[a-z][\s\S]*>/i;
		return htmlRegex.test(content);
	};

	const getLectureImage = async () => {
		try {
			const imageRes = await StorageService.fetchLectureImage(lectureObject.image, lectureObject._id);
			setImageUrl(imageRes);
		} catch (err) {
			setImageUrl(null);
		}
	};

	// Split text into paragraphs without cutting words
	const splitText = (text) => {
		let _paragraphs = [];

		if (text.length < 250) {
			_paragraphs.push(text);
			setParagraphs(_paragraphs);
			return;
		}

		const findBreakPoint = (str, start, direction = 1) => {
			let pos = start;
			while (pos > 0 && pos < str.length) {
				if (str[pos] === ' ') return pos;
				pos += direction;
			}
			return pos;
		};

		if (text.length <= 250) {
			_paragraphs.push(text);
		} else {
			const breakPoint1 = findBreakPoint(text, 250);
			_paragraphs.push(text.substring(0, breakPoint1));

			let remainingText = text.substring(breakPoint1);

			while (remainingText.length > 0) {
				const breakPoint = findBreakPoint(remainingText, 100);
				const chunk = remainingText.substring(0, breakPoint);
				_paragraphs.push(chunk);
				remainingText = remainingText.substring(breakPoint);
			}
		}

		setParagraphs(_paragraphs);
	};

	return (
		<View className="flex-1 bg-secondary pt-20">
			<View className="flex-col mt-5 items-center">
				<Text className="font-sans text-base text-projectGray">
                    Nome do curso: {courseObject.title}
				</Text>
				<Text className="font-sans-bold text-lg text-projectBlack">
					{lectureObject.title}
				</Text>
			</View>

			<View className="flex-1 w-full">
				<ScrollView className="max-h-128 flex-grow mt-2 mb-4 px-4">
					{htmlContent ? (
						<RenderHtml
							contentWidth={Dimensions.get('window').width}
							source={{ html: htmlContent }}
							tagsStyles={{
								p: { fontSize: 16, color: '#333' },
								h1: { fontSize: 24, fontWeight: 'bold', color: '#000' },
								h2: { fontSize: 20, fontWeight: 'bold', color: '#000' },
								// Add more styles as needed
							}}
						/>
					) : (
						paragraphs && paragraphs.map((paragraph, index) => (
							<Text
								key={index}
								className={`text-lg pt-4 px-4 ${index === 0 ? 'text-primary_custom' : 'text-projectGray'}`}
							>
								{paragraph}
							</Text>
						))
					)}
					{imageUrl && (
						<View className="w-full h-[25vh] px-4 pt-8">
							<Image source={{ uri: imageUrl }} className="w-full h-full" />
						</View>
					)}
					{paragraphs && paragraphs.length > 2 && (
						<Text className="text-[18px] px-4 text-projectGray">
							{paragraphs[paragraphs.length - 1]}
						</Text>
					)}
				</ScrollView>
			</View>

			<View className="w-100 px-6 mb-8">
				<TouchableOpacity
					className="bg-primaryCustom px-10 py-4 rounded-medium flex-row items-center justify-center"
					onPress={handleContinue}
				>
					<View className='flex-row items-center'>
						<Text className="text-center font-sans-bold text-body text-projectWhite">
                            Continuar
						</Text>
						<Icon
							name="chevron-right"
							type="material"
							size={24}
							color="white"
							style={{ marginLeft: 8 }}
						/>
					</View>
				</TouchableOpacity>
			</View>
		</View>
	);
};

TextImageLectureScreen.propTypes = {
	lectureObject: PropTypes.object.isRequired,
	courseObject: PropTypes.object.isRequired,
	isLastSlide: PropTypes.bool.isRequired,
	onContinue: PropTypes.func.isRequired,
	handleStudyStreak: PropTypes.func.isRequired
};

export default TextImageLectureScreen;
