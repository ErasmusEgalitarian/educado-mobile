import React, { useState, useEffect } from 'react';
import { Alert, View, TouchableOpacity } from 'react-native';
import Text from '../../components/general/Text';
import * as StorageService from '../../services/StorageService';
import SectionCard from '../../components/section/SectionCard';
import { ScrollView } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CustomProgressBar from '../../components/exercise/Progressbar';
import BaseScreen from '../../components/general/BaseScreen';
import SubscriptionCancel from '../../components/section/CancelSubscriptionButton';
import { unsubscribe } from '../../services/StorageService';
import PropTypes from 'prop-types';
import { checkProgressCourse, checkProgressSection } from '../../services/utilityFunctions';

/**
 * Section screen component that displays a list of sections for a given course.
 * @param {object} route - The route object containing the courseId parameter.
 * @returns {JSX.Element} - The SectionScreen component.
 */
export default function SectionScreen({ route }) {
	SectionScreen.propTypes = {
		route: PropTypes.object,
	};
	const { course } = route.params;
	const navigation = useNavigation();
	const [sections, setSections] = useState(null);
	const [studentProgress, setStudentProgress] = useState([0, 0, 0]);
	const [completedComponents, setCompletedComponents] = useState(0);

	/**
   * Loads the sections for the given course from the backend.
   * @param {string} id - The id of the course to load sections for.
   */
	async function loadSections(id) {
		const sectionData = await StorageService.getSectionList(id);
		setSections(sectionData);
	}

	const checkProgress = async () => {
		const progress = await checkProgressCourse(course.courseId);
		if (Array.isArray(progress)) {
			setStudentProgress(progress);
		} else {
			setStudentProgress([0, 0, 0]);
		}
	};

	const checkProgressInSection = async (sectionId) => {
		const completed = await checkProgressSection(sectionId);
		setCompletedComponents(completed);
	};

	useEffect(() => {
		// this makes sure loadcourses is called when the screen is focused
		const update = navigation.addListener('focus', () => {
			checkProgress();
		});
		return update;
	}, [navigation]);

	// Fetch courses from backend and replace dummy data!
	useEffect(() => {
		let componentIsMounted = true;

		/**
     * Loads the sections and course data for the given courseId.
     */
		async function loadData() {
			await loadSections(course.courseId);
		}

		if (componentIsMounted) {
			loadData();
		}

		checkProgress();

		return () => componentIsMounted = false;
	}, []);

	/**
   * Displays an alert to confirm unsubscribing from the course.
   */
	const unsubAlert = () =>
		Alert.alert('Cancelar subscrição', 'Tem certeza?', [
			{
				text: 'Não',
				style: 'cancel',
			},
			{ text: 'Sim', onPress: () => { unsubscribe(course.courseId); setTimeout(() =>  {navigation.goBack();}, 300 ); }},
		]);

	return (
		<BaseScreen>
			<View className="flex flex-row flex-wrap items-center justify-between px-6 pt-[20%]">

				{/* Back Button */}
				<TouchableOpacity className="pr-3" onPress={() => navigation.goBack()}>
					<MaterialCommunityIcons name="chevron-left" size={25} color="black" />
				</TouchableOpacity>

				{/* Course Title */}
				<Text className="text-[25px] font-bold">{course.title}</Text>
			</View>

			{/* Conditionally render the sections if they exist */}
			{sections ? (
				sections.length === 0 ? null : (
					<View className="flex-[1] flex-col my-[10px]">

						{/* Progress Bar */}
						<CustomProgressBar width={60} progress={studentProgress} height={3}></CustomProgressBar>

						{/* Section Cards */}
						<ScrollView className="mt-[5%]" showsVerticalScrollIndicator={false}>
							{sections.map((section, i) => {
								checkProgressInSection(section.sectionId);
								return <SectionCard key={i} section={section} course={course} progress={completedComponents}></SectionCard>;
							})}
						</ScrollView>
						{/* Unsubscribe Button */}
						<SubscriptionCancel onPress={unsubAlert} />
					</View>
				)
			) : null}

		</BaseScreen>
	);
}
