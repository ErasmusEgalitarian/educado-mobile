import React, {useState, useEffect} from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons, } from '@expo/vector-icons';
import tailwindConfig from '../../../tailwind.config';
import PropTypes from 'prop-types'; 
import { getAllFeedbackOptions } from '../../../api/api';


/* Check the CompleteCourseSlider file in the screens folder for more info */

export default function Feedback({ setFeedbackData }) {
	Feedback.propTypes = {
		setFeedbackData: PropTypes.func.isRequired,
	};

	const [selectedRating, setSelectedRating] = useState(0);
	const [feedbackOptions, setFeedbackOptions] = useState([{name: 'Muito informativo', id: '123'}
		,{name: 'Muito útil', id: '456'}
		,{name: 'Muito bem explicado', id: '789'}
		,{name: 'Muito fácil de entender', id: '101'
	}]);
	const [selectedOptions, setSelectedOptions] = useState([]);
	const [feedbackText, setFeedbackText] = useState('');
	
	
	useEffect(() => {
		const fetchFeedbackOptions = async () => {
			try {
				const options = await getAllFeedbackOptions();
				console.log(options);
				setFeedbackOptions(options);
			}
			catch(e) {
				console.log(e);
			}
		}
		fetchFeedbackOptions();
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
						{feedbackOptions.map((option, index) => {
							const id = option._id;
							const selected = selectedOptions.includes(id)
							return (
								<Pressable key={index} onPress={() => handleOptionClick(id)}>
								<View className={`rounded-full px-4 py-2 m-2 bg-projectWhite  ${selected ?  'bg-bgprimary_custom' : ''}`}>
									<Text className={`text-projectBlack font-montserrat-semi-bold ${selected ? 'text-projectWhite' : ''}`}  >
									{option.name}
									</Text>
								</View>
								</Pressable>
							)	
						})}
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
