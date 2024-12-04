import { View, Image, Pressable } from 'react-native';
import React from 'react';
import { useFonts, VarelaRound_400Regular } from '@expo-google-fonts/dev';
import { useNavigation } from '@react-navigation/native';
import { AppLoading } from 'expo-app-loading';
import Text from '../general/Text';
import PropTypes from 'prop-types';


export default function ActiveExploreCard({ title, courseId, iconPath }) {
	const navigation = useNavigation();
	let [fontsLoaded] = useFonts({
		VarelaRound_400Regular
	});

	if (!fontsLoaded) {
		return AppLoading;
	} else {
		return (
			<Pressable
				style={{ shadowColor: 'black', elevation: 10 }}
				className="w-2/5 h-24 rounded-md items-center flex-col bg-limeGreen m-2"
				onPress={() => navigation.navigate('Course', { courseId: courseId })}
			>
				<View className="">
					<Text numberOfLines={1} style={{ fontFamily: 'VarelaRound_400Regular', fontSize: 16, alignSelf: 'center' }} className="pt-4 text-gray-600">
						{title}
					</Text>
				</View>
				<View className="pt-2">
					{iconPath === '' ? <Image className="w-10 h-10" source={require('../../assets/images/favicon.png')}></Image> : <Image className="w-10 h-10" source={{ uri: iconPath }}></Image>}
				</View>
			</Pressable>
		);
	}
}

ActiveExploreCard.propTypes = {
	title: PropTypes.string,
	courseId: PropTypes.string,
	iconPath: PropTypes.string,
};