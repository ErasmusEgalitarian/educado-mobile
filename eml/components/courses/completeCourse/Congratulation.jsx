import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import Text from '../../general/Text';
import LottieView from 'lottie-react-native';
import { getUserInfo } from '../../../services/StorageService';

/* Check the CompleteCourseSlider file in the screens folder for more info */

export default function Congratulation() {
	const [name, setName] = useState('');

	const getName = async () => {
		const userInfo = await getUserInfo();
		setName(userInfo.firstName);
	};

	useEffect(() => {
		getName();
	}, []);

	return (
		<View className="flex w-full h-full justify-start items-center">
			<Text className="text-center font-sans-bold text-3xl text-primary_custom p-4">Excelente trabalho, você terminou!</Text>

			<View className="h-80 w-full items-center">
				<LottieView
					style={{
						width: '100%',
						height: '100%',
					}}
					source={require('../../../assets/animations/rocket.json')}
					autoPlay
				/>
			</View>

			<View>
				<Text className="text-center text-lg text-projectBlack px-5 mt-12">
					Bom trabalho, {name}! Você pode ver suas estatísticas, placar educado e certificação antes de continuar.
				</Text>
			</View>
		</View>
	);
}
