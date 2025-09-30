import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Text from '../../components/general/Text';
import * as StorageService from '../../services/StorageService';
import { checkProgressSection } from '../../services/utilityFunctions';
import { ScrollView } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import SectionCard from '../../components/section/SectionCard';

export default function SectionScreen({ route }) {
	const { course, section } = route.params;
	const [components, setComponents] = useState(null);
	const [completedCompAmount, setCompletedCompAmount] = useState(0);

	const navigation = useNavigation();
	async function loadComponents(id) {
		const componentsData = await StorageService.getComponentList(id);
		setComponents(componentsData);
	}

	async function loadData() {
		await loadComponents(section.sectionId);
		setCompletedCompAmount(await checkProgressSection(section.sectionId));
	}

	useEffect(() => {
		let componentIsMounted = true;

		if (componentIsMounted) {
			loadData();
		}

		return () => {
			componentIsMounted = false;
		};
	}, [section.sectionId]);

	useEffect(() => {
		const update = navigation.addListener('focus', () => {
			loadData();
		});

		return update;
	}, [navigation, section.sectionId]);

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
	const getIcon = (component) => {
		return component.type === 'exercise' ? (
			'book-open-blank-variant'
		) : component.component.contentType === 'text' ? (
			'book-edit'
		) : 'play-circle';
	};

	return (
		<ScrollView className="bg-secondary h-full">
			{/* Back Button */}
			<View className="flex flex-col p-6">
				<View className="flex flex-row items-center pb-2">
					<TouchableOpacity onPress={navigateBack}>
						<MaterialCommunityIcons name="chevron-left" size={25} color="black" />
					</TouchableOpacity>
					<View className="left-3">
						<Text className="text-[20px] font-montserrat ">{course.title}</Text>
					</View>
				</View>
				<View className="flex-inital py-2">
					<Text className="text-[28px] font-montserrat-bold">{section.title}</Text>
					<Text className="text-[16px] font-montserrat border-b-[1px] border-lightGray">{section.description}</Text>
				</View>
			</View>
			{components ? (
				components.length === 0 ? null : (
					<View>
						{components.map((component, i) => {
							const isDisabled = i > completedCompAmount;
							const isCompleted = i < completedCompAmount;
							return (
								<SectionCard
									disableProgressNumbers={true}
									numOfEntries={1}
									progress={isCompleted ? 1 : 0}
									title={component.component.title}
									icon={getIcon(component)}
									disabledIcon="lock-outline"
									key={i}
									onPress={() => navigateToComponent(i)}
									disabled={isDisabled}
								/>
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
