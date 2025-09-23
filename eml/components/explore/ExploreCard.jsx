import React, {useState} from 'react';
import {Image, Modal, View, Button, Text, Dimensions, TouchableOpacity} from 'react-native';
import UpdateDate from './ExploreUpdate';
import CardLabel from './CardLabel';
import CustomRating from './CustomRating';
import BottomDrawer from './BottomDrawer';
import SubscriptionButton from './SubscriptionButton';
import AccessCourseButton from './AccessCourseButton';
import * as Utility from '../../services/utilityFunctions';
import PropTypes from 'prop-types';
import { Link } from '@react-navigation/native';


/**
 * This component is used to display a course card.
 * @param course - The course object to be displayed.
 * @param isPublished - Boolean value that indicates if the course is published. If false, the card will not be displayed.
 * @param subscribed - Boolean value that indicates if the user is subscribed to the course.
 * @returns {JSX.Element|null} - Returns a JSX element. If the course is not published, returns null.
 */
export default function ExploreCard({ course, isPublished, subscribed }) {

	const windowHeight = Dimensions.get('window').height;
	const windowWidth = Dimensions.get('window').width;

	const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

	const handleToggleBottomSheet = () => {
	setIsBottomSheetOpen(!isBottomSheetOpen);
	};

	return isPublished ? (
		<View
			className="bg-projectWhite rounded-lg shadow-sm shadow-projectBlack mb-4 mx-4 p-6 overflow-hidden"
		>
			<View className="flex-col items-center">
				<View className="flex-row justify-between w-full items-center">
					<Text className="text-projectBlack font-medium text-lg">{course.title}</Text>
				</View>

				<View className="h-1 border-b-[1px] w-full border-projectGray opacity-50 pt-2"></View>

				<View className="w-full h-[0.5] pt-2" />
				<View className="flex-row justify-between w-full items-start">
					<View className="flex-col items-start justify-between">
						<View className="flex-column items-start justify-start pb-2 flex-wrap">
							<CardLabel
								title={Utility.determineCategory(course.category)}
								icon={Utility.determineIcon(course.category)}
							/>
							<View className="w-2.5" />
							<CardLabel
								title={Utility.formatHours(course.estimatedHours)}
								icon={'clock-outline'}
							/>
							<View className="w-2.5" />
							<CardLabel
								title={Utility.getDifficultyLabel(course.difficulty)}
								icon={'book-multiple-outline'}
							/>
						</View>
						<View className="h-1.25 opacity-50" />
						<CustomRating rating={course.rating} />

					</View>

				</View>

			</View>

				<View className="py-7 flex-row items-center justify-between px-1">
					<Text className="text-projectBlack text-m">{course.description}</Text>
				</View>

				<View className="flex-row justify-end">
					<TouchableOpacity onPress={handleToggleBottomSheet}>
						<Text className="text-projectBlack text-m">saiba mais</Text>
					</TouchableOpacity>
					<Modal
						animationType="slide"
						transparent={true}
						visible={isBottomSheetOpen}
						onRequestClose={handleToggleBottomSheet}>

							<View className="flex-start items-center absolute bottom-0 bg-projectWhite rounded-t-[40px] shadow-2xl shadow-projectBlack" 
							style={{height: windowHeight * 0.87, width: windowWidth * 1}}>
									<View className="w-full justify-between flex-row">
										<Text className="text-3xl font-medium">title</Text>
										<TouchableOpacity onPress={handleToggleBottomSheet}>
											<Text>x</Text>
										</TouchableOpacity>
									</View>
							</View> 
					</Modal>

				</View>

			<View className="items-start absolute">
				<View className="rotate-[315deg] items-center">
					{
						subscribed ? (
							<Text className="bg-yellow text-xs text-projectWhite font-bold px-8 -left-8 -top-4 drop-shadow-sm">
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