import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Text from '../../components/general/Text';
import * as StorageService from '../../services/StorageService';
import { checkProgressSection } from '../../services/utilityFunctions';
import { ScrollView } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';





export default function SectionScreen({ route }) {
	const { course, section } = route.params;
	const [components, setComponents] = useState(null);
	const [completedCompAmount, setCompletedCompAmount] = useState(0);

	const navigation = useNavigation();
	async function loadComponents(id) {
		const componentsData = await StorageService.getComponentList(id);
		setComponents(componentsData);
	}

	useEffect(() => {
		let componentIsMounted = true;

		async function loadData() {
			await loadComponents(section.sectionId);
			setCompletedCompAmount(await checkProgressSection(section.sectionId));
		}

		if (componentIsMounted) {
			loadData();
		}

		return () => {
			componentIsMounted = false;
		};
	}, []);

	const getProgressStatus = (compIndex) => {
		if(compIndex < completedCompAmount) {
			return 'Concluído';
		} else if (compIndex == completedCompAmount) {
			return 'Em progresso';
		} else {
			return 'Não iniciado';
		}
	};


	const navigateBack = () => {
		navigation.goBack();
	};
	const navigateToComponent = (compIndex) => {
		navigation.navigate('Components', {
			section: section,
			parsedCourse: course,
			parsedComponentIndex: compIndex
		});
	};

	return (
		<ScrollView className="bg-secondary h-full">
			{/* Back Button */}
			<TouchableOpacity className="absolute top-10 left-5 pr-3 z-10" onPress={navigateBack}>
				<MaterialCommunityIcons name="chevron-left" size={25} color="black" />
			</TouchableOpacity>
			<View className="flex my-6 mx-[18]  ">
				<View className="flex-none items-center justify-center py-6">
					<Text className=" text-[20px] font-montserrat ">{course.title}</Text>
				</View>
				<View className="flex-inital py-2">
					<Text className="text-[28px] font-montserrat-bold ">{section.title}</Text>
					<Text className="text-[16px] font-montserrat border-b-[1px] border-lightGray">{section.description}</Text>
				</View>
			</View>
			{components ? (
				components.length === 0 ? null : (
					<View>
						{components.map((component, i) => {
							const isDisabled = i > completedCompAmount;
							return (
								<TouchableOpacity 
									key={i}
									className={`bg-secondary border-[1px] border-lightGray rounded-lg shadow-lg shadow-opacity-[0.3] mb-[15] mx-[18] overflow-hidden elevation-[8] ${isDisabled ? 'opacity-50' : ''}`}
									onPress={() => { navigateToComponent(i); }}
									disabled={isDisabled}
								>
									<View className="flex-row items-center justify-between px-[25] py-[15]">
										<View>
											<Text className="text-[18px] font-montserrat-bold">{component.component.title}</Text>
											<Text> 
												{getProgressStatus(i)} 
												{i < completedCompAmount ?
													<MaterialCommunityIcons
														testID={'check-circle'}
														name={'check-circle'}
														size={16}
														color="green"
													/> : ''
												}
											</Text>
										</View>
										{ isDisabled ? (
											<MaterialCommunityIcons name="lock-outline" size={30} color="#166276"/>
										) : component.type === 'exercise' ? (
											<MaterialCommunityIcons name="book-open-blank-variant" size={30} color="#166276"/>
										) : component.component.contentType === 'text' ? (
											<MaterialCommunityIcons name="book-edit" size={30} color="#166276"/>
										) : (
											<MaterialCommunityIcons name="play-circle" size={30} color="#166276"/>
										)}
										
									</View>
								</TouchableOpacity>
							);
						})}
					</View>
				)
			) : null}
		</ScrollView>
	);
}

SectionScreen.propTypes = {
	route: PropTypes.shape({
		params: PropTypes.shape({
			section: PropTypes.object.isRequired,
			course: PropTypes.object.isRequired,
		}).isRequired,
	}).isRequired,
};
