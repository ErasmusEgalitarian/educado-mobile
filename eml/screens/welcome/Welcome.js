import React from 'react';
import { View, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { BgLinearGradient } from '../../constants/BgLinearGradient';
import WelcomeSlider from '../../components/welcome/WelcomeSlider';
import Text from '../../components/general/Text.js';
import { useNavigation } from '@react-navigation/native';

/* 
Description: 	This is the welcome screen that is shown when the user opens the app for the first time.
				It is a slider that explains the app and its features. It also has a button to login and a button to register.
				When the user clicks on the login button, it is redirected to the login screen.
				When the user clicks on the register button, it is redirected to the register screen.
*/

export default function WelcomeScreen() {

	const navigation = useNavigation();

	return (
		<BgLinearGradient>
			<SafeAreaView >
				<View className="justify-center items-center flex flex-col">
          
					<View className="flex mb-[20%] pt-[30%]">
						<Image 
							source={require('../../assets/images/logo.png')}
							className="w-[175.88] h-[25.54]"
						/>
					</View>        
    
					<View className="flex flex-row w-screen justify-center items-center mb-[15%]">
						<WelcomeSlider />
					</View>

					<View className="justify-center">
						
						<View className="px-6">
							<TouchableOpacity
								className="bg-primaryCustom px-12 py-3 rounded-medium"
								onPress={() => navigation.navigate('LoginStack', {screen: 'Login'}, { previousScreen: 'Welcome' })}
							>
							<Text className="text-center font-sans-bold text-body text-projectWhite">
								{/* Login */}
								Entrar
							</Text>
							</TouchableOpacity>
						</View>

						<View className="mt-[24px] px-6 w-screen">
                            <Text
                                className="text-center font-sans-bold underline text-body text-projectBlack"
                                onPress={() => { navigation.navigate('LoginStack', { screen: 'Register' }, {previousScreen: 'Welcome'}); }}
                            >
                                Cadastrer
                            </Text>
						</View>

					</View>
				</View>
			</SafeAreaView>
		</BgLinearGradient>
	);
}

