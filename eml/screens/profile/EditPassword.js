import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Components
import { View,SafeAreaView, } from 'react-native';
import PasswordField from '../../components/general/forms/PasswordField';
import FormButton from '../../components/general/forms/FormButton';
import ToastNotification from '../../components/general/ToastNotification';
import BackButton from '../../components/general/BackButton';
import { useNavigation } from '@react-navigation/native';
import Text from '../../components/general/Text';
// Services
import { updateUserPassword } from '../../api/userApi';
import { getUserInfo, getJWT } from '../../services/StorageService';
import FormFieldAlert from '../../components/general/forms/FormFieldAlert';
import { validatePasswordContainsLetter, validatePasswordLength } from '../../components/general/Validation';

/**
 * Edit password screen
 * @returns {React.Element} Component for the edit profile screen
 */
export default function EditPassword() {
	// States
	const [currentPassword, setCurrentPassword] = useState('');
	const [isCurrentPasswordWrong, setIsCurrentPasswordWrong] = useState(false);
	const [oldPasswordAttempt, setOldPasswordAttempt] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [isFormFilledOut, setIsFormFilledOut] = useState(false);
	const [wrongCurentPasswordAlert, setWrongCurrentPasswordAlert] = useState('');
	const [newPasswordAlert, setNewPasswordAlert] = useState('');
	const [confirmPasswordAlert, setConfirmPasswordAlert] = useState('');
	const navigation = useNavigation();

	// password validation
	useEffect(() => {		
		// Reset the wrong password alert if the user changes their current password
		if (isCurrentPasswordWrong && oldPasswordAttempt !== currentPassword) {
			setWrongCurrentPasswordAlert('');
			setIsCurrentPasswordWrong(false);
		}
	
		// Password validation
		if (!validatePasswordContainsLetter(newPassword)) {
			setNewPasswordAlert('Senha deve conter pelo menos 1 letra');
		} else if (!validatePasswordLength(newPassword)) {
			setNewPasswordAlert('Senha muito curta! Mínimo 8 caracteres');
		} else {
			setNewPasswordAlert('');
		}
		
		// Check if newPassword and confirmPassword match
		if (newPassword !== confirmPassword) {
			setConfirmPasswordAlert('As senhas não coincidem!');
		} else {
			setConfirmPasswordAlert('');
		}
		
		// Reset alerts when fields are empty
		if (newPassword.length === 0) setNewPasswordAlert('');
		if (confirmPassword.length === 0) setConfirmPasswordAlert('');
	
	}, [currentPassword, newPassword, confirmPassword, oldPasswordAttempt, isCurrentPasswordWrong]);
	

	useEffect(() => {
		setIsFormFilledOut(checkIsFormFilledOut());
	}, [currentPassword, newPassword, confirmPassword, wrongCurentPasswordAlert, newPasswordAlert, confirmPasswordAlert]);

	// Gauge whether the form is filled out
	const checkIsFormFilledOut = () => {
		if(currentPassword.length == 0) return false;
		if(newPassword.length == 0) return false;
		if(confirmPassword.length == 0) return false;
		if(wrongCurentPasswordAlert != '') return false;
		if(newPasswordAlert != '') return false;
		if(confirmPasswordAlert != '') return false;
		return true;
	};

	// Submit password change
	const submitForm = async () => {
		try {
			// Get user ID
			const userInfo = await getUserInfo();
			const JWT = await getJWT();
	
			// Make request
			await updateUserPassword(userInfo.id, currentPassword, newPassword, JWT);
			
			// safe true to a session storage to show a success message in the profile screen
			await AsyncStorage.setItem('passwordUpdated', 'true');
	
			// Clear form fields and reset alerts
			setCurrentPassword('');
			setNewPassword('');
			setConfirmPassword('');
			setWrongCurrentPasswordAlert('');
			setNewPasswordAlert('');
			setConfirmPasswordAlert('');
			
			// Navigate to the profile screen
			navigation.navigate('Perfil');
			console.log('navigating');
		} catch(error) {
			// Handle errors
			console.log('Error updating password:', error?.data?.error ?? error);
	
			switch (error?.error?.code) {
			case 'E0806':
				// Your password is incorrect
				console.log('Your password is incorrect!');
				setWrongCurrentPasswordAlert('Senha atual está incorreta!');
				setOldPasswordAttempt(currentPassword);
				setIsCurrentPasswordWrong(true);
				break;
			default: 
				ToastNotification('error', 'Erro desconhecido!');
			}
		}
	};
	return (
		
		<SafeAreaView className='bg-secondary'>
			<View className='flex flex-col mx-4 z-10'>
				<View>
					<View className='relative mt-12 mb-6'>
						{/* Back button */}
						<BackButton onPress={() => navigation.navigate('Perfil')} />

						{/* Title */}
						<Text className='w-full text-center text-xl font-sans-bold'>
				Alterar senha
						</Text>
					</View>
				</View>
				<PasswordField
					label='Senha atual'
					password={currentPassword}
					setPassword={setCurrentPassword}
					className='mb-4'
				/>
				<FormFieldAlert testId="wrongCurentPasswordAlert" label={wrongCurentPasswordAlert} />
				<PasswordField
					label='Nova senha'
					password={newPassword}
					setPassword={setNewPassword}
					className='mb-4'
				/>
				<FormFieldAlert testId="newPasswordAlert" label={newPasswordAlert} />
				<PasswordField
					label='Confirmar senha'
					password={confirmPassword}
					setPassword={setConfirmPassword}
				/>
				<FormFieldAlert testId="confirmPasswordAlert" label={confirmPasswordAlert} />
				<FormButton
					testId='confirmButton'
					onPress={submitForm}
					disabled={!isFormFilledOut}
					className='mt-4'
				>
				Confirmar
				</FormButton>
			</View>
		</SafeAreaView>
	);
}