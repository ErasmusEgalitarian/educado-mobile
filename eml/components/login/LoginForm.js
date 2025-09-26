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

	const navigation = useNavigation();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [modalVisible, setModalVisible] = useState(false);
	const [passwordAlert, setPasswordAlert] = useState('');
	const [emailAlert, setEmailAlert] = useState('');
	// State variable to track password visibility
	const [showPassword, setShowPassword] = useState(false);

    // state variable to track if user successfully submitted phone number
    const [submittedPhoneNumber, setSubmittedPhoneNumber] = useState(false);

    // phone number state variables
	const [phoneAlert, setPhoneAlert] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');

	// input token
	const [token, setToken] = useState('');

    // allow + symbol at start, then digits only (5 - 25 minmax length)
    const validatePhoneNumber = (phone) => /^\+?\d{5,25}$/.test(phone);

    const handlePhoneChange = (inputPhone) => {
        setPhoneNumber(inputPhone);

        // if typing
        if (inputPhone.length > 0) {
            validatePhoneNumber(inputPhone) ? setPhoneAlert('') : setPhoneAlert('Número de Teléfono Inválido');
        } else {
            setPhoneAlert('');
        }
    };

    const submitPhoneNumber = () => {
        //TODO: call backend and get a real res;

        const res = { success: Math.random() > 0.5 }; // coin-toss

        if(res.success){
            setSubmittedPhoneNumber(true);
        } else {
            setSubmittedPhoneNumber(false);
            //TODO: render error here
        }

    }


	/**
   * Logs user in with the entered credentials 
   * @param {String} email Email user tries to login with
   * @param {String} password Password user tries to login with
   */
	async function login(token) {

		//The Object must be hashed before it is sent to backend (before loginUser() is called)
		//The Input must be conditioned (at least one capital letter, minimum 8 letters and a number etc.)
		const obj = {
			email: email,
			password: password,
		};


		// Await the response from the backend API for login
		await loginUser(obj).then(async (response) => {
			// Set login token in AsyncStorage and navigate to home screen
			await setJWT(response.accessToken);
			await setUserInfo({ ...response.userInfo });
			await AsyncStorage.setItem('isLoggedIn', 'true');
			navigation.navigate('HomeStack');
		}).catch((error) => {
			switch (error?.error?.code) {
			case 'E0003':
				// Error connecting to server!
				ShowAlert('Erro de conexão com o servidor!');
				break;
				
				// TODO: What error should we give here instead? Unknown error? 
			default: // Errors not currently handled with specific alerts
				ShowAlert('Erro desconhecido!');
			}
		});
	}


	// Function to close the reset password modal
	const closeModal = () => {
		setModalVisible(false);
	};


	// Function to toggle the password visibility state
	const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	};

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
					{ submittedPhoneNumber ? "Insira o código enviado para você" : "Por favor, insira o seu número de telefone"}
				</Text>
			</View>

            {/* Step 1: input Phone number */}
            {!submittedPhoneNumber ? (
                <>
                    <View className="mb-6">
                        <FormTextField
                            testId="passwordInput"
                            placeholder="(XX) XXXXX-XXXX " // Type your password
                            bordered={true}
                            keyboardType={"numeric"}
                            onChangeText={(inputPassword) => {
                                handlePhoneChange(inputPassword);
                                setPassword(removeEmojis(inputPassword, password));
                            }}
                            error={phoneAlert ? true : false}
                        />
                    </View>

                    {/* render alert */}
                    {phoneAlert ? (
                        <View className="mb-4">
                            <Text className="font-montserrat text-sm text-center color-error">
                                {phoneAlert}
                            </Text>
                        </View>
                    ) : null}

                    <FormButton
                        onPress={submitPhoneNumber}
                    >
                        Enviar Código
                    </FormButton>
                </>
            ) : (
                <>
                    {/* Step 2: input Token */}
                     <View className="mb-6">
                        <TokenInputField
                            onChange={(tokenValue) => setToken(tokenValue)}
                        />
                    </View>

                    {/* render alert */}
                    {phoneAlert ? (
                        <View className="mb-4">
                            <Text className="font-montserrat text-sm text-center color-error">
                                {phoneAlert}
                            </Text>
                        </View>
                    ) : null}


                    <FormButton
                        onPress={() => login(token)}
                        disabled={token.length < 6}
                    >
                        Accesor Conta
                    </FormButton>
                </>
            )}

		</View>
	);
}
