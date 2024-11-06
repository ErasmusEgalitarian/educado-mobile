import React, {useState, useEffect} from 'react';
import { Pressable, ScrollView, Text, TextInput, View, Keyboard } from 'react-native';
import { MaterialCommunityIcons, } from '@expo/vector-icons';
import tailwindConfig from '../../../tailwind.config';
import PropTypes from 'prop-types'; 
import { getAllFeedbackOptions } from '../../../api/api';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';


/* Check the CompleteCourseSlider file in the screens folder for more info */

export default function Feedback({ setFeedbackData }) {
	Feedback.propTypes = {
		setFeedbackData: PropTypes.func.isRequired,
	};

	const [selectedRating, setSelectedRating] = useState(0);
	const [feedbackOptions, setFeedbackOptions] = useState([]);
	const [selectedOptions, setSelectedOptions] = useState([]);
	const [feedbackText, setFeedbackText] = useState('');
	
	
	useEffect(() => {
		const fetchFeedbackOptions = async () => {
			try {
				const options = await getAllFeedbackOptions();
				setFeedbackOptions(options);
			}
			catch(e) {
				console.error(e);
			}
		};
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

	const ratingText = () => {
		switch (selectedRating) {
		case 1:
			return 'Muito Ruim';
		case 2:
			return 'Ruim';
		case 3:
			return 'Neutro';
		case 4:
			return 'Bom!';
		case 5:
			return 'Muito Bom!';
		default:
			return '';
		}
	};

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
		icon: 'star',
		color: index < selectedRating ? tailwindConfig.theme.colors.yellow : tailwindConfig.theme.colors.unselectedStar,
	}));

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
			<View className='flex w-full items-center px-6'>
				<Text className="text-center font-sans-bold text-3xl text-primary_custom p-4 mt-11">Conte o que achou sobre o curso!</Text>               
				<View className="flex items-center w-full border-b-[1px] border-lightGray py-4">
					<Text className="font-montserrat-bold text-body-large">Como você avalia este curso?</Text>
					<View className="flex flex-row items-center">
						<Text className="text-sm font-montserrat">Escolha de 1 a 5 estrelas para classificar</Text>
						<Text className="text-error ml-1 pt-2 text-body text-center">*</Text>
					</View>
					
					<View className="w-full flex-row items-center justify-center">
						{ratingIcons.map((icon, index) => (
							<Pressable key={index} onPress={() => handleStarClick(index)}>
								<MaterialCommunityIcons key={index} name={icon.icon} size={52} color={icon.color} />
							</Pressable>
						))}
					</View>
					<Text className="font-montserrat text-caption-medium">{ratingText()}</Text>
				</View>
				<View className="flex items-center w-full border-b-[1px] border-lightGray my-4">
					<Text className="font-montserrat-bold text-body-large">O que você mais gostou no curso?</Text>
					<ScrollView className="max-h-48  my-2">
						<View className="flex-row flex-wrap items-center justify-around p-2">
							{feedbackOptions.map((option, index) => {
								const id = option._id;
								const selected = selectedOptions.includes(id);
								return (
									<Pressable key={index} onPress={() => handleOptionClick(id)}>
										<View className={`rounded-lg border-[1px] px-2 py-2 my-[5px] border-cyanBlue  ${selected ?  'bg-bgprimary_custom' : ''}`}>
											<Text className={`text-cyanBlue font-montserrat ${selected ? 'text-projectWhite' : ''}`}  >
												{option.name}
											</Text>
										</View>
									</Pressable>
								);	
							})}
						</View>
					</ScrollView>
				</View>
				<View className="w-full flex items-center">
					<Text className="font-montserrat-bold text-body-large">Deixe um comentário:</Text>
					<View className="w-full">
						<TextInput
							className=" w-full h-[100px] border-[1px] border-projectGray rounded-lg p-4 my-4 font-montserrat-bold text-top"
							placeholder="Escreva aqui seu feedback"
							placeholderTextColor={'#A1ACB2'}
							onChangeText={text => setFeedbackText(text)}
							value={feedbackText}
							multiline
						/>
					</View>
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
}
