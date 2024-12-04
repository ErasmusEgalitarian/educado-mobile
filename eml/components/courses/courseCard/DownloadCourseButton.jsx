import React, { useEffect, useRef, useState } from 'react';
import LottieView from 'lottie-react-native';
import {Alert, TouchableWithoutFeedback} from 'react-native';
import animationAsset from '../../../assets/animations/downloadAnimation.json';
import PropTypes from 'prop-types';
import * as StorageService from '../../../services/StorageService';

const ANIMATION_STATES = {
	INITIAL: 'initial',
	DOWNLOADING: 'downloading',
	FINISHING: 'finishing',
	COMPLETED: 'completed',
	DELETE: 'delete',
};

/**
 * DownloadCourseButton component displays a button that downloads a course
 * @param {object} props - Props containing the course the button is on
 * @returns {JSX.Element} - The DownloadCourseButton component
 */
export default function DownloadCourseButton(props) {
	const {course, disabled = false} = props;
	const animationRef = useRef(null);
	const [animationState, setAnimationState] = useState(ANIMATION_STATES.INITIAL);

	const storageCheck = async () => {
		if (animationState === ANIMATION_STATES.INITIAL || animationState === ANIMATION_STATES.COMPLETED) {
			let result = await StorageService.checkCourseStoredLocally(course.courseId);
			setAnimationState(result ? ANIMATION_STATES.COMPLETED : ANIMATION_STATES.INITIAL);
		}
	};

	storageCheck();

	// Play animation based on animation state
	// Hardcoded frame numbers are based on the animation
	// https://lottiefiles.com/animations/download-ZdWE0VoaZW
	useEffect(() => {
		if (animationRef.current) {
			switch (animationState) {
			case ANIMATION_STATES.INITIAL:
				return animationRef.current.play(17, 17);

			case ANIMATION_STATES.DOWNLOADING:
				return animationRef.current.play(18, 77);

			case ANIMATION_STATES.FINISHING:
				// 2333ms is the duration of the animation from frame 78 to 148
				setTimeout(() => setAnimationState(ANIMATION_STATES.COMPLETED), 2333);
				return animationRef.current.play(78, 148);

			case ANIMATION_STATES.COMPLETED:
				return animationRef.current.play(149, 149);

			case ANIMATION_STATES.DELETE:
				// 1066ms is the duration of the animation from frame 110 to 78
				setTimeout(() => setAnimationState(ANIMATION_STATES.INITIAL), 1066);
				return animationRef.current.play(110, 78);

			default:
				break;
			}
		}
	}, [animationState]);

	const downloadConfirmation = () =>
		Alert.alert('Baixar curso', 'Deseja baixar este curso para acesso offline?', [
			{
				text: 'Cancelar',
				style: 'cancel',
			},
			{
				text: 'Baixar',
				onPress: async () => {
					setAnimationState(ANIMATION_STATES.DOWNLOADING);
					await StorageService.storeCourseLocally(course.courseId).then(result => {
						if (result){
							setAnimationState(ANIMATION_STATES.FINISHING);
						} else {
							alert('Não foi possível baixar o curso. Certifique-se de estar conectado à Internet.'); //Could not download course. Make sure you are connected to the internet
							setAnimationState(ANIMATION_STATES.INITIAL);
						}
					});
				},
			},
		]);

	const removeDownloadConfirmation = () =>
		Alert.alert('Remover curso', 'Tem certeza de que deseja remover este curso baixado?', [
			{
				text: 'Cancelar',
				style: 'cancel',
			},
			{
				text: 'Remover',
				onPress: () => {
					StorageService.deleteLocallyStoredCourse(course.courseId).then(result => {
						if(result){
							setAnimationState(ANIMATION_STATES.DELETE);
						} else {
							alert('Algo deu errado. Não foi possível remover os dados armazenados do curso.'); //Something went wrong. Could not remove stored course data.
							setAnimationState(ANIMATION_STATES.DELETE);
						}
					});
				},
				style: 'destructive',
			},
		]);

	const handlePress = () => {
		if (disabled) {
			return;
		}
		if (animationState === ANIMATION_STATES.INITIAL) {
			downloadConfirmation();
		}
		if (animationState === ANIMATION_STATES.COMPLETED) {
			removeDownloadConfirmation();
		}
	};

	return (
		<TouchableWithoutFeedback onPress={handlePress} disabled={disabled}>
			<LottieView
				ref={animationRef}
				source={animationAsset}
				height={32}
				width={24}
			/>
		</TouchableWithoutFeedback>
	);
}

DownloadCourseButton.propTypes = {
	course: PropTypes.object,
	disabled: PropTypes.bool,
};