import React from 'react';
import PropTypes from 'prop-types';

import { Pressable, View, Text } from 'react-native';


export default function TextIconButton({ text = '360', onClick, pressed = false }) {



	return (
		<Pressable onPress={onClick} >
			< View className={pressed ? 'flex-col rounded-full justify-center active:bg-opacity-50 items-center  w-[10vw] h-[10vw] bg-projectWhite' : 'flex-col rounded-full justify-center active:bg-opacity-50 items-center  w-[10vw] h-[10vw] bg-primaryCustom '}>
				<Text className={pressed ? 'text-primary_custom text-sm font-semibold' : 'text-projectWhite text-sm font-semibold'} >{text}p</Text>
			</View >
		</Pressable>
	);
}

TextIconButton.propTypes = {
	text: PropTypes.string,
	onClick: PropTypes.func,
	pressed: PropTypes.bool,
};