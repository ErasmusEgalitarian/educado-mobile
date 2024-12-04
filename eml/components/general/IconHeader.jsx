import React from 'react';
import { View, Image } from 'react-native';
import Text from './Text';
import PropTypes from 'prop-types';
import OfflineBanner from './OfflineBanner';

/**
 * Custom header component with an icon and title.
 * @param {string} title - The title to display next to the icon.
 * @returns {JSX.Element} The IconHeader component.
 */
export default function IconHeader({ title, description }) {

	IconHeader.propTypes = {
		title: PropTypes.string,
		description: PropTypes.string,
	};

	return (
		<>
			<OfflineBanner />
			<View className="flex flex-row items-center pl-6 pb-2 pt-[20%]">
            
				<Image
					source={require('../../assets/images/singleIcon.png')}
					alt="Icon"
					className="w-8 h-8 mr-2"
				/>
				<Text className="text-xl font-bold">{title}</Text>
            
			</View>
			<Text className="text-sm font-montserrat px-6 pl-6 pb-4">{description}</Text>
		</>
	);
}
