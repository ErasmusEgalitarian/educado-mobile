import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { loginUser } from '../../api/userApi';
import Text from '../general/Text';
import ShowAlert from '../general/ShowAlert';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LoginFigure from '../../assets/images/login-figure.png';
import { Image } from 'react-native';

// Remove all below. Since they are useless. Except for maybe remove emojis
import FormTextField from '../general/forms/FormTextField';
import TokenInputField from '../general/forms/TokenInputField';
import FormButton from '../general/forms/FormButton';
import PasswordEye from '../general/forms/PasswordEye';
import ResetPassword from './ResetPassword';
import FormFieldAlert from '../general/forms/FormFieldAlert';
import { removeEmojis } from '../general/Validation';


// Services
import { setUserInfo, setJWT } from '../../services/StorageService';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Login form component for login screen containing email and password input fields and a login button.
 * @returns {React.Element} Component for logging in (login screen)
 */
export default function LoginForm() {

    /* 
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [modalVisible, setModalVisible] = useState(false);
        const [passwordAlert, setPasswordAlert] = useState('');
        const [emailAlert, setEmailAlert] = useState('');
    */

	const navigation = useNavigation();

    // state variable to track if user successfully submitted phone number
    const [phoneSubmitted, setPhoneSubmitted] = useState(false);

    const [phoneNumber, setPhoneNumber] = useState('');
	const [error, setError] = useState('');
	const [token, setToken] = useState('');


    // allow + symbol at start, then digits only (5 - 25 minmax length)
    const validatePhoneNumber = (phone) => /^\+?[\d\s]{5,25}$/.test(phone);

    const handlePhoneChange = (inputPhone) => {
        setPhoneNumber(inputPhone);

        if (inputPhone.length > 0) {
            validatePhoneNumber(inputPhone) ? setError('') : setError('NÚMERO DE TELÉFONO INVÁLIDO');
        } else {
            setError('');
        }
    };

    const handlePhoneSubmit = () => {
    
        if(phoneSubmitted) {
          void login(token);
          return;
        }

        const res = { success: true }; //TODO: call backend and get a real res;

        if(res.success){
            setPhoneSubmitted(true);
            setError('');
        } else {
            setPhoneSubmitted(false);
            setError(res?.error);
        }

    }


	/**
   * Logs user in with the entered credentials 
   * @param {String} email Email user tries to login with
   * @param {String} password Password user tries to login with
   */
	async function login(token) {

        const res = { success: true }; //TODO: call backend and get a real res;

        if(res.success){
            await AsyncStorage.setItem('isLoggedIn', 'true');
			navigation.navigate('HomeStack');
        } else {
            setError("CÓDIGO INVÁLIDO");
        }

		// //The Object must be hashed before it is sent to backend (before loginUser() is called)
		// //The Input must be conditioned (at least one capital letter, minimum 8 letters and a number etc.)
		// const obj = {
		// 	email: email,
		// 	password: password,
		// };


		// Await the response from the backend API for login
		// await loginUser(obj).then(async (response) => {
		// 	// Set login token in AsyncStorage and navigate to home screen
		// 	await setJWT(response.accessToken);
		// 	await setUserInfo({ ...response.userInfo });
        // await AsyncStorage.setItem('isLoggedIn', 'true');
        // navigation.navigate('HomeStack');
		// }).catch((error) => {
		// 	switch (error?.error?.code) {
		// 	case 'E0003':
		// 		// Error connecting to server!
		// 		ShowAlert('Erro de conexão com o servidor!');
		// 		break;
				
		// 		// TODO: What error should we give here instead? Unknown error? 
		// 	default: // Errors not currently handled with specific alerts
		// 		ShowAlert('Erro desconhecido!');
		// 	}
		// });
	}

    const handleResendCode = () => {
         const res = { success: true }; //TODO: call backend and get a real res;

        if(res.success){
            // TODO: maybe notify the user that the a new code has been sent?
        } else {
            setError(res?.error);
        }
    }

    const updateToken = (token) => {
        setToken(token)
        setError("");
    } 

	return (
		<View className='flex flex-col justify-center'>
			<View className='items-center'>
				<Image
					source={LoginFigure}
					className="mb-4 mt-7"
					resizeMode="contain"
				/>
				<View>
					<Text className="font-montserrat-bold text-2xl text-center  mb-2">
						Bem-vindo de volta!
					</Text>
				</View>
				
				<Text className="font-montserrat text-lg leading-5 w-48 text-center mb-6">
					{ phoneSubmitted ? "Insira o código enviado para você" : "Por favor, insira o seu número de telefone"}
				</Text>
			</View>

            {/* step 1: phone number input.
                step 2: token input */}
            <View className="mb-6">
                {!phoneSubmitted ? (
                    <FormTextField
                        testId="passwordInput"
                        placeholder="(XX) XXXXX-XXXX "
                        bordered={true}
                        keyboardType={"numeric"}
                        onChangeText={(inputPassword) => {
                            handlePhoneChange(inputPassword);
                            //setPassword(removeEmojis(inputPassword, password));
                        }}
                        error={error ? true : false}
                    />
                ) : (
                    <TokenInputField
                        onChange={(tokenValue) => updateToken(tokenValue)}
                        error={error ? true : false}
                    />
                )}
            </View>

            {/* error */}
            {error ? (
                <View className="mb-4">
                    <Text className="font-montserrat text-sm text-center color-error">
                        {error}
                    </Text>
                </View>
            ) : null}

            {/* submit phone number / submit token */}
            <FormButton
                onPress={handlePhoneSubmit}
                disabled={phoneSubmitted && token.length !== 6}
            >
                {phoneSubmitted ? "Accesor Conta" : "Enviar Código"}
            </FormButton>

            {/* Register button */}
            {!phoneSubmitted ? (
                <View className="flex-row justify-center mt-4 w-full px-8">
                    <Text className="text-xs text-projectBlack mr-1">
                        NÃO POSSUI UMA CONTA? {/* Dont have an account yet? */}
                    </Text>
                    <Text
                        testId="registerNav"
                        className={'text-xs text-profileCircle underline left-1'}
                        onPress={() => navigation.navigate('Register', { previousScreen: 'Login' })}
                    >
                        CADASTRE-SE AGORA {/* Sign up now */}
                    </Text>
                </View>
            ) : (
                <View className="flex-row justify-end mt-4 w-full px-8">
                    <Text 
                        className="text-xs text-projectBlack mr-0"
                        onPress={handleResendCode}
                    >
                        REENVIAR CÓDIGO {/* Resend Code */}
                    </Text>
                </View>
            )}
        </View>
    )
}
