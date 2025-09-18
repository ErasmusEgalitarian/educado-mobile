import React, { useContext, useEffect, useState } from 'react';
import {
	Image,
	View,
	Text,
	Modal,
	TouchableOpacity,
	TouchableWithoutFeedback,
} from 'react-native';
import * as StorageService from '../../../services/StorageService';
import PropTypes from 'prop-types';
import { checkCourseStoredLocally } from '../../../services/StorageService';
import trashCanOutline from '../../../assets/images/trash-can-outline.png';
import fileDownload from '../../../assets/images/file_download.png';
import { IconContext } from '../../../services/DownloadService';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const DownloadCourseButton = ({ course, disabled }) => {
	const [isDownloaded, setIsDownloaded] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const { iconState, updateIcon } = useContext(IconContext);

	useEffect(() => {
		let isMounted = true;

		const checkIfDownloaded = async () => {
			try {
				const result = await checkCourseStoredLocally(course.courseId);
				if (isMounted) {
					setIsDownloaded(result);
					if (
						iconState[course.courseId] !==
						(result ? trashCanOutline : fileDownload)
					) {
						updateIcon(
							course.courseId,
							result ? trashCanOutline : fileDownload
						);
					}
				}
			} catch (error) {
				console.error('Error checking if course is downloaded:', error);
			}
		};

		checkIfDownloaded();
		return () => {
			isMounted = false;
		};
	}, [course.courseId, iconState, updateIcon]);

	const handleDownload = async () => {
		try {
			const result = await StorageService.storeCourseLocally(
				course.courseId
			);
			if (result) {
				setIsDownloaded(true);
				updateIcon(course.courseId, trashCanOutline);
			} else {
				alert(
					'Não foi possível baixar o curso. Certifique-se de estar conectado à Internet.'
				);
			}
		} catch (error) {
			console.error('Error downloading course:', error);
		}
		setModalVisible(false);
	};

	const handleRemove = async () => {
		try {
			const result = await StorageService.deleteLocallyStoredCourse(
				course.courseId
			);
			if (result) {
				setIsDownloaded(false);
				updateIcon(course.courseId, fileDownload);
			} else {
				alert(
					'Algo deu errado. Não foi possível remover os dados armazenados do curso.'
				);
			}
		} catch (error) {
			console.error('Error removing downloaded course:', error);
		}
		setModalVisible(false);
	};

	const handlePress = () => {
		if (disabled) return;
		setModalVisible(true);
	};

	return (
		<View>
			<TouchableOpacity onPress={handlePress} disabled={disabled}>
				<View className='w-8 h-8 items-center justify-center'>
					{isDownloaded ? (
						<Image source={trashCanOutline} className='w-6 h-7' />
					) : (
						<Image source={fileDownload} className='w-8 h-8' />
					)}
				</View>
			</TouchableOpacity>

			<Modal
				animationType='fade'
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}>
				{/* Outer View with semi-transparent black background */}
				<TouchableWithoutFeedback
					onPress={() => setModalVisible(false)}>
					<View
						style={{
							flex: 1,
							backgroundColor: 'rgba(0, 0, 0, 0.5)',
							justifyContent: 'center',
							alignItems: 'center',
						}}>
						<TouchableWithoutFeedback>
							{/* Modal content container */}
							<View className='w-[90%] bg-projectLightGray rounded-xl p-5'>
								<View className='flex-row justify-between items-center'>
									<Text className='text-xl font-bold mb-1 text-projectBlack'>
										{isDownloaded
											? 'Excluir download'
											: 'Baixar download'}
									</Text>
									<MaterialCommunityIcons
										size={24}
										name='close'
										color={'gray'}
										onPress={() =>
											setModalVisible(false)
										}></MaterialCommunityIcons>
								</View>
								<Text className='text-base text-projectBlack mb-2.5'>
									Você tem certeza que deseja excluir o
									download do curso? Você ainda pode
									assisti-lo com acesso à internet e baixá-lo
									novamente.
								</Text>
								<View className='flex-row justify-between w-100 items-center'>
									<TouchableOpacity
										onPress={() => setModalVisible(false)}>
										<Text className='text-primary_custom text-xl border-b border-primary_custom font-bold'>
											Cancelar
										</Text>
									</TouchableOpacity>
									<TouchableOpacity
										onPress={
											isDownloaded
												? handleRemove
												: handleDownload
										}
										className={isDownloaded ? 'bg-error rounded-lg py-4 px-10': 'bg-primaryCustom rounded-lg py-4 px-10'}>
										<Text className='font-bold text-projectWhite text-xl'>
											{isDownloaded
												? 'Excluir'
												: 'Baixar'}
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						</TouchableWithoutFeedback>
					</View>
				</TouchableWithoutFeedback>
			</Modal>
		</View>
	);
};

DownloadCourseButton.propTypes = {
	course: PropTypes.object.isRequired,
	disabled: PropTypes.bool,
};

export default DownloadCourseButton;
