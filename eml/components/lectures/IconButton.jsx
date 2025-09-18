import React from 'react';
import tailwindConfig from '../../tailwind.config';
import PropTypes from 'prop-types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';


export default function IconButton({ size = 24, icon = 'menu', onClick, pressed = false }) {



	return (
		<Pressable onPress={onClick} >
			< View className={pressed ? 'flex-col rounded-full justify-center active:bg-opacity-50 items-center  w-[10vw] h-[10vw] bg-projectWhite' : 'flex-col rounded-full justify-center active:bg-opacity-50 items-center  w-[10vw] h-[10vw] bg-primaryCustom '}>
				<MaterialCommunityIcons name={icon} size={size} color={pressed ? tailwindConfig.theme.colors.primary_custom : tailwindConfig.theme.colors.projectWhite} />
			</View >
		</Pressable>
	);
}

IconButton.propTypes = {
	size: PropTypes.number,
	icon: PropTypes.string,
	onClick: PropTypes.func,
	pressed: PropTypes.bool,
};