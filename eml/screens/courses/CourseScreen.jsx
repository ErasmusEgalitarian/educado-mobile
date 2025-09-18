import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Image, Pressable, RefreshControl, ScrollView, View} from 'react-native';
import Text from '../../components/general/Text';
import * as StorageService from '../../services/StorageService';
import CourseCard from '../../components/courses/courseCard/CourseCard';
import IconHeader from '../../components/general/IconHeader';
import {shouldUpdate} from '../../services/utilityFunctions';
import ToastNotification from '../../components/general/ToastNotification';
import LoadingScreen from '../../components/loading/Loading';
import NetworkStatusObserver from '../../hooks/NetworkStatusObserver';
import AsyncStorage from '@react-native-async-storage/async-storage';
import errorSwitch from '../../components/general/errorSwitch';
import ShowAlert from '../../components/general/ShowAlert';
import Tooltip from '../../components/onboarding/onboarding';
import { getStudentInfo } from '../../services/StorageService';
import ProfileStatsBox from '../../components/profile/ProfileStatsBox';
import OfflineScreen from '../offline/OfflineScreen';

/**
 * Course screen component that displays a list of courses.
 * @component
 * @returns {JSX.Element} The course screen component.
 */
export default function CourseScreen() {
	const [courses, setCourses] = useState([]);
	const [courseLoaded, setCourseLoaded] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [isOnline, setIsOnline] = useState(false);
	const [loading, setLoading] = useState(true);
	const [studentLevel, setStudentLevel] = useState(0);
	const [studentPoints, setStudentPoints] = useState(0);
	const navigation = useNavigation();
	const [isVisible, setIsVisible] = useState(false);

	/**
    * Asynchronous function that loads the courses from storage and updates the state.
    * @returns {void}
    */
	async function loadCourses() {
		const courseData = await StorageService.getSubCourseList();
		if (shouldUpdate(courses, courseData)) {
			if (courseData.length !== 0 && Array.isArray(courseData)) {
				setCourses(courseData);
				setCourseLoaded(true);
			}
			else {
				setCourses([]);
				setCourseLoaded(false);
			}
		}
		setLoading(false);
	}

	// When refreshing the loadCourses function is called
	const onRefresh = () => {
		setRefreshing(true);
		loadCourses();
		setRefreshing(false);
	};

	
	// Retrieve student points and level from local storage 
	const fetchStudentData = async () => {
		try {
			const fetchedStudent = await getStudentInfo();

			if (fetchedStudent !== null) {
				setStudentLevel(fetchedStudent.level);
				setStudentPoints(fetchedStudent.points);
			}
		} 
		catch (error) {
			ShowAlert(errorSwitch(error));
		}
	};
	
	useEffect(() => {
		// this makes sure loadCourses is called when the screen is focused
		return navigation.addListener('focus', () => {
			loadCourses();
			fetchStudentData();
		});
	}, [navigation]);

	useEffect(() => {
		const logged = async () => {
			const loggedIn = await AsyncStorage.getItem('loggedIn');
			if (loggedIn) {
				setTimeout(async () => {
					ToastNotification('success', 'Logado!');
					await AsyncStorage.removeItem('loggedIn');
				}, 1000);
			}
		};
		try {
			logged();
		} catch (e) {
			ShowAlert(errorSwitch(e));
		}
	}, []);

	return (
		loading ? (
			<LoadingScreen />
		) : (
			<>
				<NetworkStatusObserver setIsOnline={setIsOnline} />
				{!isOnline ? (
					<OfflineScreen />
				) : courseLoaded ? (
					<View height="100%">
						<IconHeader
							title="Bem Vindo!"
							description="Aqui você encontra todos os cursos em que você está inscrito!"
						/>
						
						{/* Render stats box with level and progress bar only */}
						<View className="px-5">
							<ProfileStatsBox 
								level={studentLevel || 0} 
								points={studentPoints || 0} 
								drawProgressBarOnly={true} 
							/>
						</View>
	
						<ScrollView
							showsVerticalScrollIndicator={false}
							refreshControl={
								<RefreshControl 
									refreshing={refreshing} 
									onRefresh={onRefresh} 
								/>
							}>
							{courses.map((course, index) => (
								<CourseCard 
									key={index} 
									course={course} 
									isOnline={isOnline} 
								/>
							))}
						</ScrollView>
					</View>
				) : (
					<View className="bg-secondary justify-center items-center">
						<Tooltip
							isVisible={isVisible}
							position={{
								top: -150,
								left: 95,
								right: 5,
								bottom: 24,
							}}
							setIsVisible={setIsVisible}
							text="Bem-vindo ao Educado! Nesta página central, você encontrará todos os cursos em que está inscrito."
							tailSide="right"
							tailPosition="20%"
							uniqueKey="Courses"
							uniCodeChar="📚"
						/>
						<View className="pt-24 pb-16">
							<Image
								source={require('../../assets/images/logo.png')}
								className="justify-center items-center"
							/>
						</View>
	
						<View className="justify-center items-center py-10 gap-10">
							<View className="justify-center items-center w-full h-auto px-10">
								<Image source={require('../../assets/images/no-courses.png')} />
								<Text className="leading-[29.26] text-projectBlack pb-4 pt-4 font-sans-bold text-subheading text-center">
									Comece agora
								</Text>
								<Text className="text-projectBlack font-montserrat text-center text-body">
									Você ainda não se increveu em nenhum curso. Acesse a página Explore e use a busca para encontrar cursos do seu interesse.
								</Text>
							</View>
							<View>
								<Pressable
									testID="exploreButton"
									className="rounded-r-8 rounded-md bg-primaryCustom justify-center items-center py-4 w-full h-auto px-20"
									onPress={() => navigation.navigate('Explorar')}>
									<Text className="text-projectWhite font-sans-bold text-center text-body">
										Explorar cursos
									</Text>
								</Pressable>
							</View>
						</View>
					</View>
				)}
			</>
		)
	);
}	