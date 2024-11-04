import React from 'react';
import { View } from 'react-native';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';

/**
 * Component for showing a toast notification
 * @param {string} status status of the notification (success, warning, error, other)
 * @param {string} message message to be displayed in the notification
 */
export default function ToastNotification(status, message) {
	console.log('grillet toast - ' + status + ' - ' + message);
	return (
		<View className='z-100'>
			{status === 'success' ?
				Toast.show({
					type: ALERT_TYPE.SUCCESS,
					title: 'Sucesso!',
					textBody: message,
				}) : status === 'warning' ?
					Toast.show({
						type: ALERT_TYPE.WARNING,
						title: 'Aviso!',
						textBody: message,
					}) : status === 'error' ?
						Toast.show({
							type: ALERT_TYPE.DANGER,
							title: 'Erro!',
							textBody: message,
						}) :
						Toast.show({
							type: ALERT_TYPE.INFO,
							title: 'Notificação!',
							textBody: message,
						})},
		</View>
	);
}