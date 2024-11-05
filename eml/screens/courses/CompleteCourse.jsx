import React, { useRef } from 'react';
import { View, TouchableOpacity, SafeAreaView } from 'react-native';
import { BgLinearGradient } from '../../constants/BgLinearGradient';
import CompleteCourseSlider from '../../components/courses/completeCourse/CompleteCourseSlider';
import Text from '../../components/general/Text.js';
import { useNavigation, useRoute } from '@react-navigation/native';
import PropTypes from 'prop-types';


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
	const completeCourseSliderRef = useRef(null);
	let currentSlide = 0;

	const navigation = useNavigation();
	const route = useRoute();
	const { course } = route.params;

	
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
		currentSlide = index;
	};

	const handleNextSlide = () => {
		if (!completeCourseSliderRef.current) { return; }
		if (currentSlide === 0) {
			navigation.reset({
				index: 0,
				routes: [{ name: 'HomeStack' }],
			});
		} else {
			completeCourseSliderRef.current.scrollBy(1);
		}
	};

	return (
		<BgLinearGradient>
			<SafeAreaView >
				<View className="justify-around items-center flex flex-col h-full w-full">
					<View className="flex w-screen h-5/6 justify-center items-center">
						<CompleteCourseSlider 
							onIndexChanged={handleIndexChange}
							ref={completeCourseSliderRef}  
							courseObject={course}
						/>
					</View>

					<View className="px-6 w-screen">
						<TouchableOpacity className="bg-primary_custom px-10 py-4 rounded-medium"
							onPress={() => {handleNextSlide();}}
						>
							<Text className="text-center font-sans-bold text-body text-projectWhite">Continuar</Text>
						</TouchableOpacity>
					</View>

				</View>
			</SafeAreaView>
		</BgLinearGradient>
	);
}

CompleteCourseScreen.propsTypes = {
	course: PropTypes.object.isRequired,
};

