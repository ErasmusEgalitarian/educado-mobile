import React, {useState} from 'react';
import {Image, Modal, View, Button, Text, Dimensions, TouchableOpacity} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import UpdateDate from './ExploreUpdate';
import CardLabel from './CardLabel';
import CustomRating from './CustomRating';
import BottomDrawer from './BottomDrawer';
import SubscriptionButton from './SubscriptionButton';
import AccessCourseButton from './AccessCourseButton';
import * as Utility from '../../services/utilityFunctions';
import PropTypes from 'prop-types';
import { Link } from '@react-navigation/native';
import CourseDetail from './CourseDetail';
import { determineIcon, determineCategory, formatHours, checkProgressCourse} from '../../services/utilityFunctions';


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
					<TouchableOpacity onPress={handleToggleBottomSheet} className="flex-row border-b border-tealButton items-center px-1 py-0.5">
						<Text className="text-tealButton text-xs font-semibold mr-1">saiba mais</Text> 
						<MaterialCommunityIcons name="chevron-double-right" color='#35A1B1' size={12} />
					</TouchableOpacity>
					<Modal
						animationType="slide"
						transparent={true}
						visible={isBottomSheetOpen}
						onRequestClose={handleToggleBottomSheet}>

							<View className="flex-1" style={{ backgroundColor: 'rgba(255,255,255,0.5)'}}/>

							<View className="flex-start px-8 py-10 w-full h-full justify-between items-center absolute bottom-0 bg-projectWhite rounded-t-[40px] shadow-2xl shadow-projectBlack" 
							style={{height: windowHeight * 0.87, width: windowWidth * 1}}>
							
								<View className="flex-column w-full">
									
									<View className="flex-row justify-between items-center mb-4"> 
										<Text className="text-3xl font-medium">{course.title}</Text>
										<TouchableOpacity onPress={handleToggleBottomSheet}>
											<MaterialCommunityIcons name={'chevron-down'} size={25} color="#383838"></MaterialCommunityIcons>
										</TouchableOpacity>	
									</View>
										
									<View className="flex-row items-center mb-4">
										<MaterialCommunityIcons size={12} name={determineIcon(course.category)} color={'#628397'}/>
										<Text className="text-xs text-grayScale ml-1 mr-2">{determineCategory(course.category)}</Text>
										
										<MaterialCommunityIcons size={12} name="clock" color={'#628397'}/>
										<Text className="text-xs text-grayScale ml-1">{course.estimatedHours} horas</Text>
									</View>
									
									<CustomRating rating={course.rating} />	

									<View className="h-2 border-b-[1px] w-full border-projectGray opacity-50 mt-4"></View>								
								</View>

								<Text className="w-full text-lg py-16">{course.description}</Text>

								<View className="w-full">
									<CourseDetail
										title={`${Utility.formatHours(course.estimatedHours)} de conteúdo (vídeos, exercícios, leituras complementares)`}
										icon="clock-outline"
									/>
									<CourseDetail
										title={`Curso de Nível ${Utility.getDifficultyLabel(course.difficulty)}`}
										icon="book-multiple-outline"
									/>
									<CourseDetail
										title="Certificado de Conclusão"
										icon="certificate-outline"
									/>
									<CourseDetail
										title="Início imediato"
										icon="clock-fast"
									/>
									<CourseDetail
										title="Acesso total por 1 ano"
										icon="calendar-month-outline"
									/>
									<CourseDetail
										title="Assista onde e quando quiser! "
										icon="cellphone-link"
									/>
								</View>

								<View className="w-full">
									{
										subscribed ? (
											<AccessCourseButton course={course} />
										) : (
											<SubscriptionButton course={course} />
										)
									}
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