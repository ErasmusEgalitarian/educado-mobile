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
	const navigation = useNavigation();

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

	useEffect(() => {
		// this makes sure loadCourses is called when the screen is focused
		return navigation.addListener('focus', () => {
			loadCourses();
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
		loading ? <LoadingScreen /> :
			<>
				<NetworkStatusObserver setIsOnline={setIsOnline}/>
				{courseLoaded ?
					<View height="100%">
						<IconHeader
							title={'Bem Vindo!'}
							description={'Aqui você encontra todos os cursos em que você está inscrito!'}/>
						<ScrollView showsVerticalScrollIndicator={false}
							refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
							{courses.map((course, index) => (
								<CourseCard key={index} course={course} isOnline={isOnline}></CourseCard>
							)
							)}
						</ScrollView>
					</View>
					:
					<View className="bg-secondary justify-center items-center ">
						<View className="pt-24 pb-16">
							<Image source={require('../../assets/images/logo.png')} className=" justify-center items-center"/>
						</View>
						<View className=" justify-center items-center py-10 gap-10 ">
							<View className=" justify-center items-center w-full h-auto  px-10">
								{/* No active courses */}
								<Image source={require('../../assets/images/no-courses.png')}/>
								<Text
									className=" leading-[29.26] text-projectBlack pb-4 pt-4 font-sans-bold text-subheading text-center ">Comece agora</Text>
								<Text className=" text-projectBlack font-montserrat text-center text-body "> Você ainda não se increveu em nenhum curso. Acesse a página Explore e use a busca para encontrar cursos do seu intresse.</Text>
								{/*You haven't signed up for any course yet. Access the Explore page and use the search to find courses that interest you.*/}
							</View>
							<View>
								<Pressable
									testID={'exploreButton'}
									className=" rounded-r-8 rounded-md bg-primary_custom justify-center items-center py-4 w-full h-auto px-20 "
									onPress={() => navigation.navigate('Explorar')}>
									{/* Click to explore courses */}
									<Text className=" text-projectWhite font-sans-bold text-center text-body "> Explorar cursos</Text>
								</Pressable>
							</View>
						</View>
					</View>}
			</>
	);
}
