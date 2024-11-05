import React from 'react';
import { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, Pressable } from 'react-native';
import FilterNavBar from '../../components/explore/FilterNavBar';
import ExploreCard from '../../components/explore/ExploreCard';
import * as StorageService from '../../services/StorageService';
import { useNavigation } from '@react-navigation/native';
import IconHeader from '../../components/general/IconHeader';
import { shouldUpdate, determineCategory } from '../../services/utilityFunctions';
import Text from '../../components/general/Text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import NetworkStatusObserver from '../../hooks/NetworkStatusObserver';

/**
 * Explore screen displays all courses and allows the user to filter them by category or search text.
 * @returns {JSX.Element} - Rendered component
 */
export default function Explore() {

	// Search text state
	const [searchText, setSearchText] = useState('');
	// Selected category state
	const [selectedCategory, setSelectedCategory] = useState(null);

	//Sets dummy data for courses (will be replaced with data from backend)
	const [courses, setCourses] = useState([]);
	const [subCourses, setSubCourses] = useState([]);
	const [isOnline, setIsOnline] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const navigation = useNavigation();

	/**
  * Asynchronous function that loads the subscribed courses from storage and updates the state.
  * @returns {void}
  */
	async function loadSubscriptions() {
		const subData = await StorageService.getSubCourseList();
		if (shouldUpdate(subCourses, subData)) {
			if (subData.length !== 0 && Array.isArray(subData)) {
				setSubCourses(subData);
			}
			else {
				setSubCourses([]);
			}
		}
	}

	/**
  * Asynchronous function that loads the courses from storage and updates the state.
  * @returns {void}
  */
	async function loadCourses() {
		const courseData = await StorageService.getCourseList();
		if (shouldUpdate(courses, courseData)) {
			if (courseData.length !== 0 && Array.isArray(courseData)) {
				setCourses(courseData);
			}
			else {
				setCourses([]);
			}
		}
	}

	// When refreshing the loadCourse and load subscription function is called
	const onRefresh = () => {
		setRefreshing(true);
		loadSubscriptions();
		loadCourses();
		setRefreshing(false);
	};

	useEffect(() => {
		// this makes sure loadcourses is called when the screen is focused
		const update = navigation.addListener('focus', () => {
			loadCourses();
			loadSubscriptions();
		});
		return update;

	}, [navigation, subCourses, selectedCategory, searchText, isOnline]);

	const checkIfSubscribed = (course, subCourses) => {
		for(let subCourse of subCourses){
			if (subCourse.courseId === course.courseId){
				return true;
			}
		}
		return false;
	};

	///---------------------------------------------///

	// Function to filter courses based on searchText or selectedCategory

	const filteredCourses = courses.filter((course) => {
		// Check if the course title includes the search text
		const titleMatchesSearch = course.title.toLowerCase().includes(searchText.toLowerCase());
		// Check if the course category matches the selected category (or no category is selected)
		const categoryMatchesFilter = !selectedCategory || determineCategory(course.category) === selectedCategory;
		// Return true if both title and category conditions are met
		return titleMatchesSearch && categoryMatchesFilter;
	});

	const handleFilter = (text) => {
		setSearchText(text);
		// console.log("handleFilter", searchText);
	};

	const handleCategoryFilter = (category) => {
		//if category label is "all" it will display all courses, otherwise it will display courses with the selected category
		if (category === 'Todos') {
			setSelectedCategory(null); // Set selectedCategory to null to show all items
		} else {
			setSelectedCategory(category); // Set selectedCategory to the selected category label
		}
	};

	return (
		<>
			<NetworkStatusObserver setIsOnline={setIsOnline} />
			<IconHeader
				title={'Explorar cursos'}
				description={'Inscreva-se nos cursos do seu interesse e comece sua jornada'}
			/>
			{!isOnline ?
				<View>
					<View className="justify-center px-1 pt-6">
						<MaterialCommunityIcons name="wifi-off" size={160} color="black" style={{ alignSelf: 'center' }} />
						<Text className="text-center font-montserrat-semi-bold text-[24px]">
							{'\n'}Sem conexão com internet.
						</Text>
						<View className="flex-row flex-wrap justify-center">
							<Text className="text-center text-body">
								{/* You are offline. Connect to the internet to explore the courses. */}
								{'\n'}Você está sem acesso a internet. Vá para
							</Text>
							<View className="flex-row flex-wrap justify-center">
								<Text className="text-center text-body font-montserrat-bold">
				meus cursos
								</Text>
								<Text className="text-center text-body">
				e acesse os cursos baixados.{'\n'}
								</Text>
							</View>
						</View>
						<View className="items-center pt-6">
							<Pressable
								testID={'offlineExploreButton'}
								className="rounded-r-8 rounded-md bg-primary_custom justify-center items-center p-2 h-14 w-80"
								onPress={() => navigation.navigate('Meus cursos')}>
								{/* Click to explore courses */}
								<Text className="text-projectWhite font-sans-bold text-center text-body" >Ir para Meus cursos</Text>
							</Pressable>
						</View>
					</View>
				</View>
				:
				<View height="77%">
					<FilterNavBar
						onChangeText={(text) => handleFilter(text)}
						onCategoryChange={handleCategoryFilter}
					/>
					<ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
						<View className="overflow-y-auto">
							{courses && filteredCourses && filteredCourses.map((course, index) => (
								<ExploreCard
									key={index}
									isPublished={course.status === 'published'}
									subscribed={/*isSubscribed[index]*/checkIfSubscribed(course, subCourses)}
									course={course}
								></ExploreCard>
							))}
						</View>
					</ScrollView>
				</View>
			}
		</>
	);
}