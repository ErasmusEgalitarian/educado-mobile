import { View, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import Text from '../general/Text';
import tailwindConfig from '../../tailwind.config';
import PropTypes from 'prop-types';


const LOGIN_TOKEN = '@loginToken';
const USER_INFO = '@userInfo';
const tailwindColors = tailwindConfig.theme.colors;
const STUDENT_INFO = '@studentInfo';

export default function LogOutButton(props) {
	LogOutButton.propTypes = {
		testID: PropTypes.string,
	};

	const navigation = useNavigation();

	async function logOut() {
		try {
			await AsyncStorage.removeItem(LOGIN_TOKEN);
			await AsyncStorage.removeItem(USER_INFO);
			await AsyncStorage.removeItem(STUDENT_INFO);

			navigation.navigate('LoginStack');
		} catch (e) {
			console.log(e);
		}
	}

	const logoutAlert = () =>
		Alert.alert('Sair', 'Tem certeza que deseja sair?', [
			{
				text: 'Não',
				onPress: () => console.log('No Pressed'),
				style: 'cancel'
			},
			{ text: 'Sim', onPress: logOut }
		]);

	return (
		<View className="items-center flex-1 mt-[12%]">
			<TouchableOpacity onPress={logoutAlert}>
				<View className='items-center flex flex-row'>
					<MaterialCommunityIcons
						name="logout"
						size={30}
						color={tailwindColors.error}
						testID={props.testID}
					/>
					<Text className="text-error text-center underline font-sans-bold">Sair</Text>
				</View> 
        
			</TouchableOpacity>
		</View>
	);
}