import React from 'react';
import { View, Pressable, Text } from 'react-native';
import PropTypes from 'prop-types';

/**
 * CertificateBtn component displays a button for certificates
 * @param buttonText - Text displayed in button
 * @param onPress - Function to be executed when button is pressed
 * @returns {JSX.Element} - Rendered component
 */
export default function CertificateBtn({ buttonText, onPress }) {

	return (
		<View className="">
			<Pressable onPress={onPress}
				className="w-full flex items-center justify-center rounded-lg bg-primaryCustom p-2"
			>
				<Text className="text-projectWhite py-1 font-bold px-2">
					{buttonText}
				</Text>
			</Pressable>
		</View>
	);
}

CertificateBtn.propTypes = {
	buttonText: PropTypes.string,
	onPress: PropTypes.func,
};

