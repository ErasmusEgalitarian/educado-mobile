import React from 'react';
import { View } from 'react-native';
import LeaveButton from '../exercise/LeaveButton';
import EducadoLogo from '../images/EducadoLogo';
import PropTypes from 'prop-types';


/**
 * Component that includes, logo, title and backbutton, used in login and register screens
 * @param {Object} props Should contain the following properties:
 * - navigationPlace: String
 * @returns {React.Element} Header/logo/back button component

 */
export default function LogoBackButton(props) {

	return (
		<View className='flex-row justify-center items-center w-full mt-4'>
			{/* TODO: Implement with general back button instead */}
			<View className='absolute left-6 z-50 w-6 h-6 flex justify-center items-center border-black-500 border-2'>
				<LeaveButton
					navigationPlace={props.navigationPlace ? props.navigationPlace : 'Home'}
				/>
			</View>
			{/* Educado logo */}
			<View className='items-center justify-center w-full'>
				<EducadoLogo />
			</View>
		</View>
	);
}

LogoBackButton.propTypes = {
	navigationPlace: PropTypes.string,
};