import React, { useState, useEffect } from 'react';
import { Alert, View, TouchableOpacity, Image } from 'react-native';
import Text from '../../components/general/Text';
import * as StorageService from '../../services/StorageService';
import SectionCard from '../../components/section/SectionCard';
import { ScrollView } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CustomProgressBar from '../../components/exercise/Progressbar';
import SubscriptionCancel from '../../components/section/CancelSubscriptionButton';
import { unsubscribe } from '../../services/StorageService';
import PropTypes from 'prop-types';
import { checkProgressCourse, checkProgressSection } from '../../services/utilityFunctions';
import ContinueSection from '../../components/section/ContinueSectionButton';
import Tooltip from '../../components/onboarding/onboarding';
import ImageNotFound from '../../assets/images/imageNotFound.png';
import DownloadCourseButton from '../../components/courses/courseCard/DownloadCourseButton';
import { getBucketImage } from '../../api/api';

export default function CourseOverviewScreen({ route }) {
	CourseOverviewScreen.propTypes = {
		route: PropTypes.object,
	};
	const { course } = route.params;
	const navigation = useNavigation();
	const [sections, setSections] = useState(null);
	const [studentProgress, setStudentProgress] = useState(0);
	const [sectionProgress, setSectionProgress] = useState({});
	const [currentSection, setCurrentSection] = useState(null);
	const [isVisible, setIsVisible] = useState(false);
	const [coverImage, setCoverImage] = useState(null);

	async function loadSections(id) {
		const sectionData = await StorageService.getSectionList(id);
		setSections(sectionData);
	}

	const checkProgress = async () => {
		const progress = await checkProgressCourse(course.courseId);
		setStudentProgress(progress);
	};

	const checkProgressInSection = async (sectionId) => {
		const completed = await checkProgressSection(sectionId);
		setSectionProgress(prevProgress => ({
			...prevProgress,
			[sectionId]: completed,
		}));
	};

	useEffect(() => {
		let componentIsMounted = true;

		async function loadData() {
			await loadSections(course.courseId);
		}

		if (componentIsMounted) {
			loadData();
		}

		return () => {
			componentIsMounted = false;
		};
	}, []);

	useEffect(() => {
		if (sections) {
			sections.forEach(section => {
				checkProgressInSection(section.sectionId);
			});
		}
	}, [sections]);

	useEffect(() => {
		if (sections) {
			const incompleteSection = sections.find(section => {
				const completedComponents = sectionProgress[section.sectionId] || 0;
				return completedComponents < section.components.length;
			});
			setCurrentSection(incompleteSection);
		}
	}, [sectionProgress, sections]);

	useEffect(() => {
		const update = navigation.addListener('focus', async () => {
			await checkProgress();
			await loadSections(course.courseId);
		});
		return update;
	}, [navigation]);

	useEffect(() => {
		if (!coverImage && course) {
			const fetchImage = async () => {
				try {
					const image = await getBucketImage(course.courseId+ '_c');
					if (typeof image === 'string') {
						setCoverImage(image);
					} else {
						throw new Error();
					}
				} catch (error) {
					console.error(error);
				}
			};
			fetchImage();
		}
	}, [course]);

	const unsubAlert = () =>
		Alert.alert('Cancelar subscrição', 'Tem certeza?', [
			{
				text: 'Não',
				style: 'cancel',
			},
			{ text: 'Sim', onPress: () => { unsubscribe(course.courseId); setTimeout(() =>  {navigation.navigate('Meus cursos');}, 300 ); }},
		]);

	const navigateToCurrentSection = () => {
		if (currentSection) {
			navigation.navigate('Components', {
				section: currentSection,
				parsedCourse: course,
			});
		}
	};
	const navigateToSpecifiedSection = (section) => {
		navigation.navigate('Section', {
			course: course,
			section: section
		});
	};

	return (
		<>
			{/* Back Button */}
			<TouchableOpacity className="absolute top-10 left-5 pr-3 z-10" onPress={() => navigation.navigate('Meus cursos')}>
				<MaterialCommunityIcons name="chevron-left" style={{backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 50}} size={25} color="black"  />
			</TouchableOpacity>
			<ScrollView className="bg-secondary" showsVerticalScrollIndicator={false}>
				<View className="flex flex-row flex-wrap justify-between bg-secondary">
					<View className="flex w-full items-center">
						<View className="flex items-center w-full justify-between">
							{coverImage ? 
								<Image class="h-full max-w-full"
									source={{uri: coverImage}}
									style={{width: '100%', height: 296, resizeMode: 'cover'}}
								/>
								:
								<Image class="h-full max-w-full" source={ImageNotFound}/>
							}
						</View>
						<View className="flex p-[14px] w-[293px] rounded-xl mt-[-10%] bg-projectWhite" style={{
							shadowRadius: 10,
							elevation: 10,
						}}>
							<View className="flex flex-row justify-between">
								{/* Course Title */}
								<Text className="text-[24px] font-montserrat mb-2 line-height-[20px] max-w-[80%]">
									{course.title}
								</Text>
								{/* TODO: Button to download course should be implemented */}
								<DownloadCourseButton course={course} disabled={true}/>
							</View>
							{/* Progress Bar */}
							<View className="flex justify-center h-6 border-y-[1px] border-lightGray rounded-sm ">
								<CustomProgressBar width={63} progress={studentProgress} height={1} displayLabel={false}></CustomProgressBar>
							</View>

							<View className="flex items-center flex-row w-full justify-between">
								<View className="flex flex-row">
									<MaterialCommunityIcons name="crown-circle" size={20} color="orange"/>
									{/* TODO: Points should be implemented */}
									<Text>?? pontos</Text>
								</View>
								<View className="flex flex-row">
									<MaterialCommunityIcons name="lightning-bolt" size={20} color="orange"/>
									<Text>{studentProgress}% concluído</Text>
								</View>
							</View>
						</View>

					</View>
				</View>
				<View className="flex items-center px-4 my-6">
					{/* Navigate to Current Section Button */}
					<ContinueSection onPress={navigateToCurrentSection} />
				</View>
				{/* Conditionally render the sections if they exist */}
				{sections ? (
					sections.length === 0 ? null : (
						<View className="flex-[1] flex-col bg-secondary">
							<Tooltip
								isVisible={isVisible}
								position={{
									top: -30,
									left: 70,
									right: 30,
									bottom: 24,
								}}
								setIsVisible={setIsVisible}
								text={'Essa é a página do seu curso. É aqui que você vai acessar as aulas e acompanhar seu progresso.'}
								tailSide="right"
								tailPosition="20%"
								uniqueKey="Sections"
								uniCodeChar="🎓"
							/>
							{/* Section Cards */}
							<View>
								{sections.map((section, i) => {
									const completedComponents = sectionProgress[section.sectionId] || 0;
									return <SectionCard
										numOfEntries={section.components.length}
										title={section.title}
										icon="chevron-right" key={i} 
										progress={completedComponents} 
										onPress={() => navigateToSpecifiedSection(section)}></SectionCard>;
								})}
								<SubscriptionCancel onPress={unsubAlert} />
							</View>
						</View>
					)
				) : null}
			</ScrollView>
		</>
	);
}
