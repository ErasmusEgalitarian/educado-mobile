import React from 'react';
import { TouchableOpacity} from 'react-native';
import Text from './Text';
import PropTypes from 'prop-types';

/* A standard button for continue */

export default function StandardButton({ props }) {
	const { onPress, buttonText } = props;
	return (
		<TouchableOpacity
			className="bg-primaryCustom px-10 py-4 rounded-lg"
			onPress={onPress}
		>
			<Text className='text-center font-sans-bold text-lg text-projectWhite'>{buttonText}</Text>
		</TouchableOpacity>
	);
}

StandardButton.propTypes = {
	onPress: PropTypes.func,
	buttonText: PropTypes.string,
	props: PropTypes.object,
};