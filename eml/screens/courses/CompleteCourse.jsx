import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import CompleteCourseSlider from '../../components/courses/completeCourse/CompleteCourseSlider';
import Text from '../../components/general/Text.js';
import { useNavigation, useRoute } from '@react-navigation/native';
import PropTypes from 'prop-types';
import { giveFeedback } from '../../api/api';
import { Icon } from '@rneui/themed';



/* 
Description: 	This screen is displayed when the student completes a course.
				The screen dispalys three slides. The first slide displays a congratulation message and an animation.
				The second slide displays a circular progress bar, which shows the percentage of exercises completed in the first try.
				The third slide displays the certificate gained by completing the course.
				When the student presses the continue button, the student is taken to the next slide. 
				On the last slide, the student is taken to the home screen when the student presses the continue button.
Dependencies: 	The student must have the course in their course list.
*/

export default function CompleteCourseScreen() {
	const [currentSlide, setCurrentSlide] = useState(0);
	const completeCourseSliderRef = useRef(null);
	const [feedbackData, setFeedbackData] = useState({});
	const [feedbackError, setFeedbackError] = useState(false);
	

	const navigation = useNavigation();
	const route = useRoute();
	const { course } = route.params;
	const isFeedbackScreen = currentSlide === 1;
	const rating = feedbackData.rating ? feedbackData.rating : 0;
	const onFBScreenNoStars = isFeedbackScreen && rating === 0;

	
	// Generate certificate for the student, Uncomment this when course completion is properly handled or to test certificates
	/* useEffect(() => {
		const CreateCertificate = async () => {
			const student = await getStudentInfo();
			const user = await getUserInfo();
			try {
				await generateCertificate(course.courseId, student, user);
				
			} catch (error) {
				console.log(error);
			}
		};

		CreateCertificate();
	}, []); */

	const handleIndexChange = (index) => {
		setCurrentSlide(index);
	};
	const handleSubmitFeedback = async () => {
		try {
			await giveFeedback(course.courseId, feedbackData);
		}
		catch (e) {
			if (e.response.status === 404) {
				setFeedbackError(true);
			}
		}
	};

	const handleNextSlide =  async () => {
		if (!completeCourseSliderRef.current) { return; }

		if (isFeedbackScreen) {
			await handleSubmitFeedback();
			navigation.reset({
				index: 0,
				routes: [{ name: 'HomeStack' }],
			});
		} else {
			completeCourseSliderRef.current.scrollBy(1);
		}
	};

	return (	
		<SafeAreaView className="bg-secondary" >
			{feedbackError && Alert.alert('Não foi possível encontrar o curso sobre o qual você deu feedback.')}
			<View className="justify-around items-center flex flex-col h-full w-full">
				<View className="flex w-screen h-5/6 justify-center items-center">
					<CompleteCourseSlider
						setFeedbackData={setFeedbackData} 
						onIndexChanged={handleIndexChange}
						ref={completeCourseSliderRef}  
						courseObject={course}
					/>
				</View>

				<View className="w-full px-6">
					<TouchableOpacity
						className={`bg-primaryCustom px-10 py-4 rounded-medium flex-row items-center justify-center ${
							onFBScreenNoStars ? 'opacity-50' : ''
						}`}
						onPress={() => {
							!(onFBScreenNoStars) && handleNextSlide();
						}}
						disabled={onFBScreenNoStars}
					>
						<View className="flex-row items-center">
							<Text className="text-center font-sans-bold text-body text-projectWhite">
								{isFeedbackScreen ? 'Enviar e concluir' : 'Continuar'}
							</Text>
							<Icon
								name="chevron-right"
								type="material"
								size={24}
								color="white"
								className="ml-2"
							/>
						</View>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>		
	);
}

CompleteCourseScreen.propsTypes = {
	course: PropTypes.object.isRequired,
};

