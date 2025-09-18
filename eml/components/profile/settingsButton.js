import {
	View,
	TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Text from '../general/Text';
import React from 'react';
  
export default function settingsButton() {
  
	const navigation = useNavigation();
  
	const handleGearIconPress = () => {
		navigation.navigate('EditProfile');
	};
    
	return (
		<View className="flex items-center px-6 w-screen my-3">
			<TouchableOpacity className="bg-primaryCustom px-10 py-4 rounded-medium w-full" onPress={handleGearIconPress}>
				<View className="flex flex-row items-center justify-center">
					<Text className="text-center font-sans-bold text-body text-projectWhite">Configurações</Text>
				</View>
			</TouchableOpacity>
		</View>
	);
}