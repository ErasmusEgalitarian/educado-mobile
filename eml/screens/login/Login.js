import React, { useCallback, useState } from 'react';
import { View, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import LoginForm from '../../components/login/LoginForm';
import LogoBackButton from '../../components/login/LogoBackButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableWithoutFeedback } from 'react-native';
import Text from '../../components/general/Text';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LoadingScreen from '../../components/loading/Loading';
import * as StorageService from '../../services/StorageService';
import { useFocusEffect } from '@react-navigation/native';

/**
 * Login screen component containing a login form and possibilities of resetting password or registering a new user.
 * @param {Object} props not used in this component as of now
*/
export default function Login() {
	
	const [loading, setLoading] = useState(true);
	const navigation = useNavigation();
	const route = useRoute();
	const previousScreen = route.params?.previousScreen || 'WelcomeStack';

	const checkLoginToken = async () => {
		try {
			const isValid = StorageService.isLoginTokenValid();
			if (isValid) {
				await StorageService.updateStoredCourses();
				await AsyncStorage.setItem('loggedIn', 'true');
				navigation.navigate('HomeStack');
			} else {
				setLoading(false);
			}
		} catch (error) {
			setLoading(false);
		}
	};

	useFocusEffect(
		useCallback(() => {
			checkLoginToken();
		}, [])
	);

	return (
		<SafeAreaView className="justify-start bg-secondary flex-1">
			{loading ? (<LoadingScreen />) :
				(<KeyboardAwareScrollView
					className="flex-1"
					resetScrollToCoords={{ x: 0, y: 0 }}
					scrollEnabled={true}>
					<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
						<View>
							<View className="mt-10">
								<LogoBackButton navigationPlace={previousScreen} />
							</View>
							<View className="mx-6">
								{/* Login form */}
								<View className="mt-8">
									<LoginForm />
								</View>
							</View>
						</View>
					</TouchableWithoutFeedback>
				</KeyboardAwareScrollView>)}
		</SafeAreaView >
	);
}
