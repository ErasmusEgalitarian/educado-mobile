import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { loginUser, registerUser } from '../../api/userApi';
import FormTextField from '../general/forms/FormTextField';
import FormButton from '../general/forms/FormButton';
import PasswordEye from '../general/forms/PasswordEye';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ShowAlert from '../general/ShowAlert';
import FormFieldAlert from '../general/forms/FormFieldAlert';
import { removeEmojis, validatePasswordContainsLetter, validatePasswordLength, validateEmail, validateName } from '../general/Validation';
import Text from '../general/Text';
import errorSwitch from '../general/errorSwitch';
import { useNavigation } from '@react-navigation/native';
import DialogNotification from '../general/DialogNotification';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import tailwindConfig from '../../tailwind.config';
import { setUserInfo, setJWT } from '../../services/StorageService';

/**
 * Component for registering a new account in the system, used in the register screen
 * @returns {React.Element} Component containing the form for registering a new user
 */

export default function RegisterForm() {

	const tailwindColors = tailwindConfig.theme.colors;

	const navigation = useNavigation();
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const [emailAlert, setEmailAlert] = useState('');
	const [nameAlert, setNameAlert] = useState('');
	const [isAllInputValid, setIsAllInputValid] = useState(false);
	const [confirmPasswordAlert, setConfirmPasswordAlert] = useState('');

	// State variable to track password visibility
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	// Password Constraint variables
	const [passwordContainsLetter, setPasswordContainsLetter] = useState(false);
	const [passwordLengthValid, setPasswordLengthValid] = useState(false);

	useEffect(() => {
		// Clear input and alerts on first render
		setFirstName('');
		setLastName('');
		setEmail('');
		setPassword('');
		setConfirmPassword('');

		setNameAlert('');
		setEmailAlert('');
		setIsAllInputValid(false);
		setConfirmPasswordAlert('');
	}, []);

	useEffect(() => {
		const containsLetter = validatePasswordContainsLetter(password);
		setPasswordContainsLetter(containsLetter);
		const lengthValid = validatePasswordLength(password);
		setPasswordLengthValid(lengthValid);
		checkIfPasswordsMatch(password, confirmPassword);
	}, [password]);

	useEffect(() => {
		checkIfPasswordsMatch(password, confirmPassword);
	}, [confirmPassword]);

	useEffect(() => {
		let validationError = '';
		if (firstName !== '') {
			validationError = validateName(firstName, 'Nome'); // First name
		}
		if (validationError === '' && lastName !== '') {
			validationError = validateName(lastName, 'Sobrenome'); // Last name
		}

		setNameAlert(validationError);
	}, [firstName, lastName]);

	useEffect(() => {
		if (email === '') {
			setEmailAlert('');
			return;
		}

		const validationError = validateEmail(email);
		setEmailAlert(validationError);
	}, [email]);

	useEffect(() => {
		validateInput();
	}, [nameAlert, emailAlert, passwordLengthValid, passwordContainsLetter, confirmPasswordAlert]);

	// Functions to toggle password visibility states
	const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const toggleShowConfirmPassword = () => {
		setShowConfirmPassword(!showConfirmPassword);
	};

	const checkIfPasswordsMatch = (password, confirmPassword) => {
		if (password === confirmPassword) {
			setConfirmPasswordAlert('');
		} else {
			// The passwords do not match
			setConfirmPasswordAlert('Os campos de senha precisam ser iguais');
		}
	};

	// TODO: This function should take into consideration
	// that alerts might be empty when input is yet to be given
	/**
   * Function for validating all input fields' content
   */
	function validateInput() {
		const validationPassed = (
			nameAlert === '' &&
      emailAlert === '' &&
      firstName != '' &&
      lastName != '' &&
      email != '' &&
      passwordLengthValid &&
      passwordContainsLetter &&
      confirmPasswordAlert === ''
		);

		setIsAllInputValid(validationPassed);
	}

	/**
   * Function for registering a new user in the database
   * @param {String} firstName 
   * @param {String} lastName
   * @param {String} email 
   * @param {String} password
   */
	async function register() {

		validateInput(firstName, email, password);

		if (!isAllInputValid) {
			return;
		}

		//Sanitize names to removes spaces infront and after
		const sanitizedFirstName = firstName.trim();
		const sanitizedLastName = lastName.trim();


		const obj = {
			firstName: sanitizedFirstName,
			lastName: sanitizedLastName,
			email: email,
			password: password,
		};

		try {
			await registerUser(obj)
				.then(async function (response) {
					// Save user info in storage
					// TODO: Refactor backend to get the same response as on login
					const userInfo = {
						id: response.baseUser._id,
						...response.baseUser,
					};
					await setUserInfo(userInfo);

				}).then(async function () {

					// logs in the user, if no errors occur, navigates to home screen and sets token
					await loginFromRegister(obj);

				})
				.catch((error) => {
					ShowAlert(errorSwitch(error));
				});
		} catch (e) {
			console.log(e);
		}
	}

	/**
 * function to log in the user and set the login token, meant to be called after registering
 * @param {Object} obj the object containing the following fields:
 *  firstName: String
 *  lastName: String
 *  email: String
 */
	async function loginFromRegister(obj) {
		try {
			await loginUser(obj).then((response) => {
				setJWT(response.accessToken);
				DialogNotification('success', 'Usuário cadastrado! Cantando em...');
				setTimeout(() => {
					navigation.navigate('HomeStack');
				}, 2500);
			}).catch((error) => {
				console.log(error);
			});
		} catch (e) {
			console.log(e);
		}
	}


	return (
		<View>
			<AlertNotificationRoot>
				<View className="mb-6">
					<FormTextField
						label="Nome" // first name
						name={'Nome'}
						value={firstName}
						testId="firstNameInput"
						placeholder="Nome"
						required={true}
						onChangeText={(firstName) => {
							setFirstName(firstName);
						}}
					/>
				</View>
				<View className="mb-6">
					<FormTextField
						label="Sobrenome" // Last name
						name={'Sobrenome'}
						value={lastName}
						testId="lastNameInput"
						placeholder="Sobrenome"

						required={true}
						onChangeText={(lastName) => {
							setLastName(lastName);
						}}
					/>
					<FormFieldAlert label={nameAlert} />
				</View>
				<View className="mb-6">
					<FormTextField
						className="mb-6"
						label="E-mail"
						name={'E-mail'}
						testId="emailInput"
						value={email}
						placeholder="Insira sua e-mail"
						keyboardType="email-address"
						required={true}
						onChangeText={async (email) => { setEmail(email); validateEmail(email); }}
					/>
					<FormFieldAlert label={emailAlert} testId="emailAlert" />
				</View>
				<View className="mb-6">
					<View className="relative">
						<FormTextField
							label="Senha" //Password
							name={'Senha'}
							testId="passwordInput"
							value={password}
							placeholder="Insira sua senha" // Enter your password
							placeholderTextColor={tailwindColors.projectGray}
							secureTextEntry={!showPassword}
							required={true}
							onChangeText={(inputPassword) => {
								setPassword(removeEmojis(inputPassword, password));

							}}
						/>
						<PasswordEye
							testId="passwordEye"
							showPasswordIcon={showPassword}
							toggleShowPassword={toggleShowPassword}
						/>
					</View>

					<View className="flex-row justify-start mt-1 h-6">

						<Text testId="passwordLengthAlert" className={'text-xs' + ((passwordLengthValid || !password) ? ' text-projectBlack' : ' text-error')}>

							{/* Minimum 8 characters */}
              • Mínimo 8 caracteres
						</Text>
						<View className="flex-row items-center -translate-y-1">
							{passwordLengthValid ? (
								<MaterialCommunityIcons name="check" size={20} color={tailwindColors.success} />
							) : null}
						</View>
					</View>
					<View className="flex-row justify-start h-6">
						<Text testId="passwordLetterAlert" className={'text-xs font-sans' + ((passwordContainsLetter || !password) ? ' text-projectBlack' : ' text-error')}>

							{/* Must contain at least one letter */}
              • Conter pelo menos uma letra
						</Text>
						<View className="flex-row items-center -translate-y-1">
							{passwordContainsLetter ? (
								<MaterialCommunityIcons name="check" size={20} color={tailwindColors.success} />
							) : null}
						</View>
					</View>
				</View>
				<View className="mb-2">
					<View className="relative">
						<FormTextField
							label="Confirmar senha" // Confirm password
							value={confirmPassword}
							testId="confirmPasswordInput"
							onChangeText={(inputConfirmPassword) => {
								setConfirmPassword(removeEmojis(inputConfirmPassword, confirmPassword));
							}}

							placeholder="Confirme sua senha" // Confirm your password
							secureTextEntry={!showConfirmPassword}
							required={true}
						/>
						<PasswordEye
							testId="confirmPasswordEye"
							showPasswordIcon={showConfirmPassword}
							toggleShowPassword={toggleShowConfirmPassword}
						/>
					</View>
					<FormFieldAlert label={confirmPasswordAlert} />
				</View>
				{/* Register */}
				<View className="my-2 bg-primary">
					<FormButton
						onPress={() => register(firstName, lastName, email, password)}
						testId="registerButton"
						disabled={!isAllInputValid}
					>
            Cadastrar
					</FormButton>
				</View>
			</AlertNotificationRoot>
		</View>
	);
}
