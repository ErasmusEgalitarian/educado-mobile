import React from 'react';
import { View, Image } from 'react-native';
import Text from '../general/Text';
import ProfileNameCircle from './ProfileNameCircle';
import PropTypes from 'prop-types';
import { FontAwesome5 } from '@expo/vector-icons';
import tailwindConfig from '../../tailwind.config';

/**
 * Component for showing user information
 * @param {Object} props should contain the following properties:
 * - firstName: string
 * - lastName: string
 * - email: string
 * - points: number
 * @returns {React.Element} React component
 */
export default function UserInfo(props) {
	const tailwindColors = tailwindConfig.theme.colors;

	UserInfo.propTypes = {
		firstName: PropTypes.string,
		lastName: PropTypes.string,
		email: PropTypes.string,
		points: PropTypes.number,
		photo: PropTypes.string,
	};

	return (
		<View className="p-6 flex flex-row items-center">
			<View className='pr-5'>
				{ props.photo 
					? <Image source={{ uri: props.photo }} className='w-24 h-24 rounded-full' />
					: <ProfileNameCircle firstName={props.firstName} lastName={props.lastName} />
				}
			</View>
			<View className='w-[70%]'>
				<Text className="text-xl font-sans-bold">{props.firstName} {props.lastName}</Text>
				<Text className="text-m font-sans-bold text-projectGray">{props.email}</Text>
				<View className='p-1 mt-1 flex flex-row'>
					<FontAwesome5 name="coins" size={24} color={tailwindColors.pointsCoin} className='flex-1'/>
					<Text className="text-m font-sans-bold text-pointsText ml-2">{props.points} pontos</Text>
				</View>
			</View>
		</View> 
	);
}