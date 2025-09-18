import React, { useState} from 'react';
import { Platform, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import ToastNotification from '../general/ToastNotification';

import * as Utility from '../../services/utilityFunctions';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import CertificateTemplate from './CertificateTemplate';
import CertificatePopup from './CertificatePopup';
import CertificateOverlay from './CertificateOverlay';
import CardLabel from '../explore/CardLabel';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { CERTIFICATE_URL } from '@env';
import PropTypes from 'prop-types';

const certificateUrl = CERTIFICATE_URL;

/**
 * This component is used to display a certificate card.
 * @param certificate - The certificate object to be displayed.
 * @param previewOnPress - The function to be executed when the preview button is pressed.
 * @returns {JSX.Element|null} - Returns a JSX element.
 */
export default function CertificateCard({ certificate }) {
	const [loading, setLoading] = useState(false);
	
	const [popupVisible, setPopupVisible] = useState(false);
	
	const handleVisualizarClick = () => {
		setPopupVisible(true);
	};
  
	const handleClosePopup = () => {
		setPopupVisible(false);
	};

	const handleDownloadClick = async () => {
		try {
			setLoading(true);
			const fileName = 'Educado Certificate ' + certificate.courseName + '.pdf';
			const url = certificateUrl + '/api/student-certificates/download?courseId=' + certificate.courseId + '&studentId=' + certificate.studentId;
			const fileUri = FileSystem.documentDirectory + fileName;
			const file = await FileSystem.downloadAsync(url, fileUri);
			const uri = file.uri;

			if (Platform.OS === 'android') {
				const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

				if (permissions.granted) {
					const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });

					await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, fileName, 'application/pdf')
						.then(async (uri) => {
							await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
							ToastNotification('success', 'Certificado baixado com sucesso!');
							handleClosePopup();
						})
						.catch(e => console.log(e));
				} else {
					await Sharing.shareAsync(uri);
					ToastNotification('success', 'Certificado baixado com sucesso!');
					handleClosePopup();
				}
			} else {
				await Sharing.shareAsync(uri);
				ToastNotification('success', 'Certificado baixado com sucesso!');
				handleClosePopup();
			}	
		} catch (e) {
			console.log('Error downloading certificate', e);
			throw e;
		} finally {
			setLoading(false);
		}
	}; 
	return (
		<View className='relative max-h-[33%] min-h-[260px]  m-2 flex items-center rounded-lg border-[3px] border-lightGray'>
			<CertificateTemplate
				studentName={certificate.studentFirstName + '' + certificate.studentLastName}
				estimatedCourseDuration={certificate.estimatedCourseDuration}
				courseName={certificate.courseName}
				dateOfCompletion={certificate.dateOfCompletion}
				creatorName={certificate.courseCreator}
			/>
			<CertificateOverlay certificate={certificate} handleVisualizarClick={handleVisualizarClick}/>
			
			<CertificatePopup visible={popupVisible} onClose={handleClosePopup}>
				<View className="flex flex-col justify-between">
					<View className="flex flex-row justify-between items-center ">
						<Text className="text-black font-medium text-lg ">{certificate.courseName}</Text>
						<TouchableOpacity onPress={handleClosePopup}>
							<MaterialIcons name='keyboard-arrow-down' size={32} color='black' />
						</TouchableOpacity>
					</View>
					
					<View className="flex-row justify-between w-full items-start mt-2">
						<View className="flex-col items-start justify-between">
							<View className="flex-row items-center justify-start pb-2 flex-wrap">
								<CardLabel
									title={Utility.determineCategory(certificate.courseCategory)}
									icon={Utility.determineIcon(certificate.courseCategory)}
								/>
								<View className="w-2.5" />
								<CardLabel
									title={Utility.formatHours(certificate.estimatedCourseDuration)}
									icon={'clock-outline'}
								/>
								<View className="w-2.5" />
								<CardLabel
									title={Utility.formatDate(certificate.dateOfCompletion)}
									icon={'calendar-check'} />
							</View>
						</View>
					</View>
					<View className="h-1 border-b-[1px] w-full border-gray opacity-20 pt-2 mb-44"></View>
					
					<View className="origin-center rotate-90 scale-150 mb-44">
						<CertificateTemplate
							studentName={certificate.studentFirstName + ' ' + certificate.studentLastName}
							estimatedCourseDuration={certificate.estimatedCourseDuration}
							courseName={certificate.courseName}
							dateOfCompletion={certificate.dateOfCompletion}
							creatorName={certificate.courseCreator}
						/>
					</View>
					<View >
						<TouchableOpacity 
							onPress={handleDownloadClick}
							disabled={loading}>
							<View className='flex flex-row justify-center items-end bg-primaryCustom py-4 px-10 rounded-lg'>
								{loading ? (
									<ActivityIndicator
										size="small"
										color="white"
									/>
								) : (
									<>
										<MaterialCommunityIcons name={'download'} size={24} color={'white'}/>
										<Text className='text-projectWhite text-lg font-montserrat-bold ml-2 text-center'>
											Baixar PDF
										</Text>
									</>
								)}
							</View>
						</TouchableOpacity>
					</View>
				</View>
			</CertificatePopup>
		</View>
	);
}

CertificateCard.propTypes = {
	certificate: PropTypes.shape({
		studentFirstName: PropTypes.string.isRequired,
		studentLastName: PropTypes.string.isRequired,
		courseCategory: PropTypes.string.isRequired,
		courseId: PropTypes.string.isRequired,
		studentId: PropTypes.string.isRequired,
		estimatedCourseDuration: PropTypes.number.isRequired,
		courseName: PropTypes.string.isRequired,
		dateOfCompletion: PropTypes.string.isRequired,
		courseCreator: PropTypes.string.isRequired,
	}).isRequired,
};
