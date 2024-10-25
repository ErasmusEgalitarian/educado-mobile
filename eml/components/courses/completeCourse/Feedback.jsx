import React, {useState, useEffect} from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons, } from '@expo/vector-icons';
import tailwindConfig from '../../../tailwind.config';
import PropTypes from 'prop-types'; 


/* Check the CompleteCourseSlider file in the screens folder for more info */

export default function Feedback({ setFeedbackData }) {
	Feedback.propTypes = {
		setFeedbackData: PropTypes.func.isRequired,
	};

	const [selectedRating, setSelectedRating] = useState(0);
	const [feedbackOptions, setFeedbackOptions] = useState([]);
	const [selectedOptions, setSelectedOptions] = useState([]);
	const [feedbackText, setFeedbackText] = useState('');

	const getFeedbackOptions = () => {
		// fetch api feedback options when implemented
		const options = [{text: 'Muito informativo', bgcolor: 'bg-limeGreen'}
			, {text: 'Muito útil', bgcolor: 'bg-badgesBlue'}, 
			{text: 'Um pouco confuso2', bgcolor: 'bg-badgesPurple2'},
			{text: 'Muito difícil2', bgcolor: 'bg-wrongAnswer'},{text: 'Muito informativo2', bgcolor: 'bg-limeGreen'}
			, {text: 'Muito útil2', bgcolor: 'bg-badgesBlue'}, 
			{text: 'Um pouco confuso3', bgcolor: 'bg-badgesPurple'},
			{text: 'Muito difícil3', bgcolor: 'bg-wrongAnswer'},{text: 'Muito informativo3', bgcolor: 'bg-limeGreen'}
			, {text: 'Muito útil3', bgcolor: 'bg-badgesBlue'}, 
			{text: 'Um pouco confuso4', bgcolor: 'bg-badgesPurple'},
			{text: 'Muito difícil4', bgcolor: 'bg-wrongAnswer'},{text: 'Muito informativo4', bgcolor: 'bg-limeGreen'}
			, {text: 'Muito útil4', bgcolor: 'bg-badgesBlue'} ];

		return options;
	};

	useEffect(() => {
		try {
			setFeedbackOptions(getFeedbackOptions());
		}
		catch(e) {
			console.log(e);
		}
	}, []);

	useEffect(() => {
		setFeedbackData({
			rating: selectedRating,
			feedbackOptions: selectedOptions,
			feedbackText: feedbackText,
		});
	}
	, [selectedRating, selectedOptions, feedbackText]
	);



	const handleStarClick = (index) => {
		const newRating = index + 1;
		setSelectedRating(newRating);
	};

	const handleOptionClick = (optionText) => {
		if (selectedOptions.includes(optionText)) {
			setSelectedOptions(selectedOptions.filter((option) => option !== optionText));

		} else {
			setSelectedOptions([...selectedOptions, optionText]);
		}
	};


	const ratingIcons = Array.from({length: 5}, (_, index) => ({
		icon: index < selectedRating ? 'star' : 'star-outline',
		color: index < selectedRating ? tailwindConfig.theme.colors.yellow : tailwindConfig.theme.colors.projectGray,
	}));

	return (
		<View className='flex w-full h-full justify-start items-center'>
			<Text className="text-center font-sans-bold text-3xl text-primary_custom p-4">Conte o que achou sobre o curso!</Text>               
			<View className="flex items-center w-full">
				<View className="flex flex-row items-center">
					<Text className="font-montserrat-semi-bold text-lg">Como você avalia o curso?</Text>
					<Text className="text-error ml-1 pt-3 text-lg text-center">*</Text>
				</View>
				<View className="w-full flex-row items-center justify-center">
					{ratingIcons.map((icon, index) => (
						<Pressable key={index} onPress={() => handleStarClick(index)}>
							<MaterialCommunityIcons key={index} name={icon.icon} size={64} color={icon.color} />
						</Pressable>
					))}
				</View>
			</View>
			<View className="flex items-center w-full">
				<Text className="font-montserrat-semi-bold text-lg bg">Qual feedback você tem para você?</Text>
				<ScrollView className="max-h-48 border-2 border-primary_custom rounded-lg my-2 mx-6">
					<View className="flex-row flex-wrap items-center justify-center p-2">
						{feedbackOptions.map((option, index) => (
							<Pressable key={index} onPress={() => handleOptionClick(option.text)}>
								<View className={`rounded-full px-4 py-2 m-2 ${option.bgcolor}
                                    ${selectedOptions.includes(option.text) ? 'border-2 border-cyanBlue' : ''}`
								}
								>
									<Text className=" text-projectBlack font-montserrat-semi-bold">{option.text}</Text>
								</View>
							</Pressable>
						))}
					</View>
				</ScrollView>
			</View>
			<View className="w-full flex items-center">
				<Text className="font-montserrat-semi-bold text-lg bg mx-6">Qualquer outro feedback que você gostaria de dar</Text>
				<View className="w-full px-6">
					<TextInput
						className=" w-full max-h-36
                            border-2 border-cyanBlue rounded-lg p-4 my-4 align-top text-lg"
						placeholder="Digite seu feedback aqui..."
						onChangeText={text => setFeedbackText(text)}
						value={feedbackText}
						multiline
					/>
				</View>
			</View>
		</View>
	);
}
