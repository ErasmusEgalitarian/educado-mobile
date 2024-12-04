import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import Swiper from 'react-native-swiper';
import ProgressTopBar from './ProgressTopBar';
import LectureScreen from './LectureScreen';
import tailwindConfig from '../../tailwind.config';
import ExerciseScreen from '../excercise/ExerciseScreen';
import { completeComponent, findIndexOfUncompletedComp } from '../../services/utilityFunctions';
import {getComponentList, getStudentInfo} from '../../services/StorageService';
import PropTypes from 'prop-types';

/* 
Description: 	This screen is displayed when the student is doing a component.
				It displays the component, which can be a lecture or an exercise.
				When the student presses the continue button, or swipes, the next component is displayed.
				The swiper is disabled when the student is doing an exercise.
				The swiper starts at the first uncompleted component in the section.
				The swiper is enabled when the student is doing a lecture.
				The screen has a progress bar at the top, which shows the progress in the section.
				It also shows the points the student has earned in the course.
Dependencies:	That there exists a course object and a section object, which has components.
Props:			- route: The route object, which contains the section object and the course object
*/

const LectureType = {
	TEXT: 'text',
	VIDEO: 'video',
};

const ComponentType = {
	LECTURE: 'lecture',
	EXERCISE: 'exercise',
};

/**
 * when navigating to this page sectionId, parsedCourse must be passed as parameters
 * @param {} param
 * @returns 
 */
export default function CompSwipeScreen({ route }) {
	const { section, parsedCourse } = route.params;
	const [loading, setLoading] = useState(true);
	const [currentLectureType, setCurrentLectureType] = useState(LectureType.TEXT);
	const [index, setIndex] = useState(0);
	const [scrollEnabled, setScrollEnabled] = useState(true);
	const [combinedLecturesAndExercises, setCombinedLecturesAndExercises] = useState([]);
	const swiperRef = useRef(null);
	const [resetKey, setResetKey] = useState(0);

	useEffect(() => {
		async function fetchData() {
			try {
				let initialIndex = findIndexOfUncompletedComp(await getStudentInfo(), parsedCourse.courseId, section.sectionId);

				if (initialIndex === -1) {
					initialIndex = 0;
				}

				const compList = await getComponentList(section.sectionId);

				if (compList[initialIndex].type === ComponentType.EXERCISE) {
					setScrollEnabled(false);
				}

				setCombinedLecturesAndExercises(compList);
				combinedLecturesAndExercises.reverse();
				setCurrentLectureType(compList[initialIndex]?.lectureType === LectureType.VIDEO ? LectureType.VIDEO : LectureType.TEXT);
				setIndex(initialIndex);
				setLoading(false);
			} catch (error) {
				setLoading(true);
			}
		}

		fetchData();
	}, [section, parsedCourse]);


	const handleExerciseContinue = (isCorrect) => {
		if (!isCorrect) {
			// Update the section component list to move the incorrect exercise to the end
			const currentComp = combinedLecturesAndExercises[index];
			const updatedCombinedLecturesAndExercises = [
				...combinedLecturesAndExercises.slice(0, index), // Elements before the current index
				...combinedLecturesAndExercises.slice(index + 1), // Elements after the current index
				currentComp // Add the current component to the end
			];
			setCombinedLecturesAndExercises(updatedCombinedLecturesAndExercises);

			// Force re-render by updating the resetKey
			setResetKey(prevKey => prevKey + 1);
		} else {
			swiperRef.current.scrollBy(1, true);
			setScrollEnabled(true);
		}

		return index === combinedLecturesAndExercises.length - 1; //True if this is last lecture/exercise
	};

	const handleIndexChange = async (_index) => {
		const currentSlide = combinedLecturesAndExercises[_index];

		if (currentSlide.type === ComponentType.EXERCISE) {
			setScrollEnabled(false);
		} else {
			const currentLectureType = currentSlide?.lectureType === LectureType.VIDEO ? LectureType.VIDEO : LectureType.TEXT;
			setCurrentLectureType(currentLectureType);
		}

		if (_index > 0) {
			const lastSlide = combinedLecturesAndExercises[_index - 1];
			if (lastSlide.type === ComponentType.LECTURE) {
				await completeComponent(lastSlide.component, parsedCourse.courseId, true);
			}
		}
		setIndex(_index);
	};

	if (loading || !section || !parsedCourse || !combinedLecturesAndExercises) {
		return (
			<View className="flex-col justify-center items-center h-screen" >
				<ActivityIndicator size="large" color={tailwindConfig.theme.colors.primary_custom} />
				<Text>Loading...</Text>
			</View>
		);
	} else {
		return (
			<View className="flex-1">
				{combinedLecturesAndExercises && (
					<View className=" absolute top-0 z-10 w-[100%]">
						<ProgressTopBar courseObject={parsedCourse} lectureType={currentLectureType} components={combinedLecturesAndExercises} currentIndex={index} />
					</View>
				)}

				{combinedLecturesAndExercises.length > 0 && parsedCourse && index !== null && (
					<Swiper
						ref={swiperRef}
						index={index}
						onIndexChanged={(_index) => handleIndexChange(_index)}
						loop={false}
						showsPagination={false}
						scrollEnabled={scrollEnabled}
					>
						{combinedLecturesAndExercises.map((comp, _index) => (
							comp.type === ComponentType.LECTURE ?
								<LectureScreen key={_index} currentIndex={index} indexCount={combinedLecturesAndExercises.length} lectureObject={comp.component} courseObject={parsedCourse} />
								:
								<ExerciseScreen key={resetKey} componentList={combinedLecturesAndExercises} exerciseObject={comp.component} sectionObject={section} courseObject={parsedCourse} onContinue={(isCorrect) => handleExerciseContinue(isCorrect)} />
						))}
					</Swiper>
				)}
			</View>
		);
	}
}

CompSwipeScreen.propTypes = {
	route: PropTypes.shape({
		params: PropTypes.shape({
			section: PropTypes.object,
			parsedCourse: PropTypes.object
		}).isRequired,
	}).isRequired,
};
