import React, { useEffect, useState, useRef } from 'react';
import { Animated, Text, Easing } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import NetworkStatusObserver from '../../hooks/NetworkStatusObserver';
import tailwindConfig from '../../tailwind.config';

/**
 * A banner component that shows an offline notification.
 * It checks periodically for backend connectivity and displays a banner if the backend is not reachable.
 * @returns {JSX.Element} - The rendered component.
 */
export default function OfflineBanner() {
	const [isOnline, setIsOnline] = useState(false);
	const translateY = useRef(new Animated.Value(-100)).current;

	useEffect(() => {
		Animated.timing(translateY, {
			toValue: isOnline ? -100 : 0, // Slide in or out
			duration: 1000,
			easing: Easing.cubic,
			useNativeDriver: true,
		}).start();
	}, [isOnline, translateY]);

	return (
		<>
			<NetworkStatusObserver setIsOnline={setIsOnline} />

			<Animated.View
				style={[{
					transform: [{translateY}],
					position: 'absolute',
					top: 0,
					width: '100%',
					zIndex: 10,
					backgroundColor: isOnline ? tailwindConfig.theme.colors.success : tailwindConfig.theme.colors.yellow,
				}]}
				className='flex-row pb-2 justify-center items-end h-[10%]'
			>
				<MaterialCommunityIcons
					name={isOnline ? 'wifi' : 'wifi-off'}
					color='black'
					size={20}
				/>
				<Text className={'px-2'}>
					{/* No internet connection! */}
					{isOnline ? 'Conectado à internet' : 'Sem conexão com a internet!'}
				</Text>
			</Animated.View>
		</>
	);
}