import React, {useState} from 'react';
import tailwindConfig from '../../tailwind.config';
import {View, TouchableOpacity} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Text from '../general/Text';
import CardLabel from './CardLabel';
import CustomRating from './CustomRating';
import BottomDrawer from './BottomDrawer';
import * as Utility from '../../services/utilityFunctions';
import PropTypes from 'prop-types';


/**
 * This component is used to display a course card.
 * @param course - The course object to be displayed.
 * @param isPublished - Boolean value that indicates if the course is published. If false, the card will not be displayed.
 * @param subscribed - Boolean value that indicates if the user is subscribed to the course.
 * @returns {JSX.Element|null} - Returns a JSX element. If the course is not published, returns null.
 */
export default function ExploreCard({ course, isPublished, subscribed }) {

	const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

	const handleToggleBottomSheet = () => {
	setIsBottomSheetOpen(!isBottomSheetOpen);
	};

	return isPublished ? (
		<View
			className="bg-surfaceSubtleCyan rounded-lg shadow-sm shadow-black mb-4 mx-4 p-6 overflow-hidden"
		>
			<View className="flex-col items-center">
				<View className="flex-row justify-normal w-full items-center">

					<MaterialCommunityIcons
						name="chart-bar-stacked"
						size={24}
						color={tailwindConfig.theme.colors.textTitle}
					/>

					<Text className="text-textTitle font-sans-bold text-base">{course.title}</Text>
				</View>

				<View className="h-1 border-b-[1px] w-full border-surfaceDisabled opacity-50 pt-2"></View>

				<View className="w-full h-[0.5] pt-2" />
				<View className="flex-row justify-between w-full items-start">
					<View className="flex-col items-start justify-between">
						<View className="flex-column items-start justify-start pb-2 flex-wrap">
							<CardLabel
								title={Utility.determineCategory(course.category)}
								icon={Utility.determineIcon(course.category)}
								color={tailwindConfig.theme.colors.grayScale}
							/>
							<View className="w-2.5 mb-1" />
							<CardLabel
								title={Utility.formatHours(course.estimatedHours)}
								icon={'clock'}
								color={tailwindConfig.theme.colors.grayScale}
							/>
							<View className="w-2.5 mb-1" />
							<CardLabel
								title={Utility.getDifficultyLabel(course.difficulty)}
								icon={'equalizer'}
								color={tailwindConfig.theme.colors.grayScale}
							/>
						</View>
						<View className="h-1.25 opacity-50" />
						<CustomRating rating={course.rating} />

					</View>

				</View>

			</View>

				<View className="py-7 flex-row items-center justify-between px-1">
					<Text className="text-textTitle text-m">{course.description}</Text>
				</View>

				<View className="flex-row justify-end">
					<TouchableOpacity onPress={handleToggleBottomSheet} className="flex-row border-b border-surfaceDefaultCyan items-center px-1 py-0.5">
						<Text className="text-surfaceDefaultCyan text-xs font-sans-semi-bold mr-1">saiba mais</Text> 
						<MaterialCommunityIcons name="chevron-double-right" color={tailwindConfig.theme.colors.surfaceDefaultCyan} size={12} />
					</TouchableOpacity>
					<BottomDrawer 
						toggleModal={handleToggleBottomSheet} 
						course={course}
						drawerState={isBottomSheetOpen} 
						subscribed={subscribed}/>
				</View>

			<View className="items-start absolute">
				<View className="rotate-[315deg] items-center">
					{
						subscribed ? (
							<Text className="bg-surfaceYellow text-xs text-surfaceSubtle font-bold px-8 -left-8 -top-4 drop-shadow-sm">
              Inscrito
							</Text>
						) : null
					}
				</View>
			</View>
		</View>
	
	) : null;
}

ExploreCard.propTypes = {
	course: PropTypes.object,
	isPublished: PropTypes.bool,
	subscribed: PropTypes.bool,
};