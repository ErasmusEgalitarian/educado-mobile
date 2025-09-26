import * as React from 'react';
import { View, Text } from 'react-native';
import * as Progress from 'react-native-progress';
import PropTypes from 'prop-types';
import { ScreenWidth, ScreenHeight } from '@rneui/base';
import tailwindConfig from '../../tailwind.config';

/**
 * A custom progress bar component.
 * @param {Object} props - The props object.
 * @param {Array} props.progress - The progress value (0-100), the amount done and the total amount.
 * @param {number} props.width - The width of the progress bar (in percentage).
 * @param {number} props.height - The height of the progress bar (in percentage).
 * @param {boolean} [props.displayLabel=true] - Whether to display the bottom text component.
 * @returns {JSX.Element} - A JSX element representing the custom progress bar.
 */
const CustomProgressBar = ({ progress, width, height, displayLabel = true }) => {
	CustomProgressBar.propTypes = {
		progress: PropTypes.arrayOf(PropTypes.number).isRequired,
		width: PropTypes.number.isRequired,
		height: PropTypes.number.isRequired,
		displayLabel: PropTypes.bool,
	};

	// Ensure progress is between 0 and 100
	progress[0] = Math.min(100, Math.max(0, progress[0]));
	if (isNaN(progress[0])){
		progress[0] = 0;
	}

	return (
		<View className='flex-row items-center justify-around'>
			<Progress.Bar
				progress={progress[0] / 100}
				width={ScreenWidth * (width / 100)}
				height={ScreenHeight * (height / 100)}
				color={tailwindConfig.theme.colors.primary}
				unfilledColor={tailwindConfig.theme.colors.emptyProgressBar}
				borderWidth={0}
				borderRadius={8}
			></Progress.Bar>
			{displayLabel && (
				<Text className='px-5 text-center font-montserrat-bold text-caption-medium text-projectBlack' 
					style={{ color: tailwindConfig.theme.colors.graytext }}>
					{progress[1]}/{progress[2]}
				</Text>
			)}
		</View>
	);
};

export default CustomProgressBar;
