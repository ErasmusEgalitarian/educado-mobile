import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { View, Dimensions } from 'react-native';
import Text from '../../general/Text';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Easing } from 'react-native-reanimated';
import { getStudentInfo } from '../../../services/StorageService';
import { findCompletedCourse } from '../../../services/utilityFunctions';
import PropTypes from 'prop-types';

/* Check the CompleteCourseSlider file in the screens folder for more info */

const StatsOverview = forwardRef(({ courseObject }, ref) => {
	StatsOverview.propTypes = {
		courseObject: PropTypes.object.isRequired,
	};

	const [percentage, setPercentage] = useState(0);
	const circleSize = Dimensions.get('window').height * 0.25;
	const tailwindConfig = require('../../../tailwind.config.js');
	const projectColors = tailwindConfig.theme.colors;
	const circularProgressRef = useRef(null);

	StatsOverview.displayName = 'StatsOverview';
  
	async function getPercentage() {
		try {
			const completedCourse = findCompletedCourse(await getStudentInfo(), courseObject.courseId);
			let totalExercises = 0;
			let totalExercisesWithFirstTry = 0;
  
			if (completedCourse) {
				for (let section of completedCourse.sections) {
					for (let comp of section.components) {
						if (comp.compType === 'exercise') {
							totalExercises++;
							if (comp.isFirstAttempt) {
								totalExercisesWithFirstTry++;
							}
						}
					}
				}
			} else {
				return 0;
			}

			return Math.round((totalExercisesWithFirstTry / totalExercises) * 100);
		} catch (error) {
			console.error('Error fetching completed courses:', error);
			return 0;
		}
	}

	const startAnimation = () => {
		circularProgressRef.current?.animate(percentage, 1250, Easing.quad);
	};

	useImperativeHandle(ref, () => ({
		startAnimation
	}));

	useEffect(() => { 
		getPercentage().then((percentage) => {
			setPercentage(percentage);
		});
	}, []);

	return (
		<View className="flex w-full h-full justify-start items-center">
			<Text className="text-center font-sans-bold text-3xl text-primary_custom p-4 mb-14">Veja suas estatísticas do curso</Text>

			<View className="w-full items-center m-5 ">
				<AnimatedCircularProgress
					ref={circularProgressRef}
					fill={0}
					size={circleSize}
					width={7.5}
					rotation={0.25}
					tintColor= {projectColors.primary_custom}
					backgroundColor={projectColors.projectWhite}
				>
					{() => (
						<Text className="text-center font-sans-bold text-2xl text-primary_custom">
							{percentage}%
						</Text>
					)}
				</AnimatedCircularProgress>
				<Text className="text-center text-lg text-projectBlack pt-10 px-10">Você respondeu {percentage}% correta, bravo!</Text>
			</View>

			{/* ---------------------------- Code for leaderboard goes from here ------------------------------------------------------------------------------------

      <Text className="text-center font-sans-bold text-lg text-projectBlack mb-3">Placar Educado</Text>

      <View className="px-6 w-screen">
        <View className="bg-lightGray h-14 rounded-full flex flex-row justify-between items-center px-2">
          <View className="flex flex-row items-center">
            <Image source={require('../../../assets/images/profileEX.jpg')} alt="arrow-right" className="h-10 w-10 rounded-full" />
            <Text className="text-center font-sans-bold text-lg text-projectWhite ml-3">Hans Zimmer</Text>
          </View>
          <Text className="text-center font-sans-bold text-lg text-projectWhite">1099</Text>
        </View>
      </View>

      <View className="px-6 w-screen z-10 -mt-3">
        <View className="bg-primary_custom h-14 rounded-full flex flex-row justify-between items-center px-2">
          <View className="flex flex-row items-center">
            <Image source={require('../../../assets/images/profileEX.jpg')} alt="arrow-right" className="h-10 w-10 rounded-full" />
            <Text className="text-center font-sans-bold text-lg text-projectWhite ml-3">Hans Zimmer</Text>
          </View>
          <Text className="text-center font-sans-bold text-lg text-projectWhite">1100</Text>
        </View>
      </View>

      <View className="px-6 w-screen -mt-3">
        <View className="bg-lightGray h-14 rounded-full flex flex-row justify-between items-center px-2">
          <View className="flex flex-row items-center">
            <Image source={require('../../../assets/images/profileEX.jpg')} alt="arrow-right" className="h-10 w-10 rounded-full" />
            <Text className="text-center font-sans-bold text-lg text-projectWhite ml-3">Hans Zimmer</Text>
          </View>
          <Text className="text-center font-sans-bold text-lg text-projectWhite">1101</Text>
        </View>
      </View>

      ---------------------------- Code for leaderboard goes to here   ------------------------------------------------------------------------------------ */}

		</View>
	);
});

export default StatsOverview;
