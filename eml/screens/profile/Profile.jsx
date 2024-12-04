import React, { useEffect, useState, useCallback } from 'react';
import ToastNotification from '../../components/general/ToastNotification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
	View,
	ScrollView,
} from 'react-native';
import LogOutButton from '../../components/profile/LogOutButton';
import ProfileNavigationButton from '../../components/profile/ProfileNavigationButton.js';

import UserInfo from '../../components/profile/UserInfo';
import { useNavigation } from '@react-navigation/native';
import { getUserInfo } from '../../services/StorageService';
import errorSwitch from '../../components/general/errorSwitch';
import ShowAlert from '../../components/general/ShowAlert';
import { getStudentInfo } from '../../services/StorageService';
import ProfileStatsBox from '../../components/profile/ProfileStatsBox';
import { useFocusEffect } from '@react-navigation/native';

/**
 * Profile screen
 * @returns {React.Element} Component for the profile screen
 */
export default function ProfileComponent() {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [photo, setPhoto] = useState('');
	const navigation = useNavigation();
	const [studentLevel, setStudentLevel] = useState(0);
	const [levelProgress, setLevelProgress] = useState(0);
	const [totalPoints, setTotalPoints] = useState(0);

	useEffect(() => {
		const getInfo = navigation.addListener('focus', () => {
			getProfile();
		});
		return getInfo;
	}, [navigation]);

	const getLevelProgress = (student) => {
		const pointsForPreviousLevel = (student.level - 1) * 100;
		const pointsForNextLevel = student.level * 100;

		return ((student.points - pointsForPreviousLevel) / (pointsForNextLevel - pointsForPreviousLevel)) * 100;
	};

	/**
  * Fetches the user's profile from local storage
  */
	const getProfile = async () => {
		try {
			const fetchedProfile = await getUserInfo();
			const fetchedStudent = await getStudentInfo();
			if (fetchedProfile !== null) {
				setFirstName(fetchedProfile.firstName);
				setLastName(fetchedProfile.lastName);
				setEmail(fetchedProfile.email);
				if (fetchedStudent !== null) setPhoto(fetchedStudent.photo);
			} else if (fetchedStudent !== null) {
				setStudentLevel(fetchedStudent.level);
				setTotalPoints(fetchedStudent.points);
				setLevelProgress(getLevelProgress(fetchedStudent));
			}
		} catch (error) {
			ShowAlert(errorSwitch(error));
		}
	};

	useFocusEffect(
		useCallback(() => {
			console.log('Profile screen focused');
			const runAsyncFunction = async () => {
				try {
					// Load profile data and check for password reset status
					await getProfile();
					await fetchStudentProfile();
					await checkPasswordReset();
				} catch (error) {
					console.error('Error fetching profile:', error);
				}
			};
	
			// Run the async function when the screen is focused
			runAsyncFunction();
		}, [])
	);


	const fetchStudentProfile = async () => {
		const studentInfo = await getStudentInfo();
		setStudentLevel(studentInfo.level);
		setTotalPoints(studentInfo.points);
		setLevelProgress(getLevelProgress(studentInfo));
	};

	const checkPasswordReset = async () => {
		try {
			console.log('Checking password reset');
			if (await AsyncStorage.getItem('passwordUpdated') == 'true') {
				ToastNotification('success', 'Senha alterada com sucesso');
				await AsyncStorage.setItem('passwordUpdated', 'false');
				return;
			}
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<ScrollView className='flex flex-col'>
			<View className="flex-1 justify-start pt-[20%] h-screen">
				<UserInfo firstName={firstName} lastName={lastName} email={email} points={totalPoints} photo={photo}></UserInfo>
				<ProfileStatsBox studentLevel={studentLevel} levelProgress={levelProgress} />
				<ProfileNavigationButton label='Editar perfil' testId={'editProfileNav'} onPress={() => navigation.navigate('EditProfile')}></ProfileNavigationButton>
				<ProfileNavigationButton label='Alterar senha' testId={'editPasswordNav'} onPress={() => navigation.navigate('EditPassword')}></ProfileNavigationButton>
				<ProfileNavigationButton label='Certificados' onPress={() => navigation.navigate('Certificate')}></ProfileNavigationButton>
				{/* // The certificate page is created and works, it is only commented out to get it approved on play store */}
					
				{/* Download page is not implemented yet. However, download works and can be accessed on home page when offline
				<ProfileNavigationButton label='Download'></ProfileNavigationButton>*/}
				<View className='flex flex-row pb-4'>
					<LogOutButton testID='logoutBtn'></LogOutButton>
				</View>
			</View>
		</ScrollView>
	);
}