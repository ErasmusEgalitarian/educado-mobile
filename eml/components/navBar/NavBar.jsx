import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '@rneui/themed';
import { Platform, Keyboard} from 'react-native';
import tailwindConfig from '../../tailwind.config';

const Tab = createBottomTabNavigator();

/**
 * This component is used to display the navigation bar at the bottom of the screen.
 * @returns {JSX.Element} - Returns a JSX element.
 *
 *
 */
export default function NavBar({
	CoursesStackComponent,
	ProfileStackComponent,
	ExploreComponent,
	EduComponent,
}) {
	const [keyboardStatus, setKeyboardStatus] = useState(0);

	useEffect(() => {
		console.log('Setting up keyboard listeners');

		const toggleSubscription = Keyboard.addListener('keyboardDidShow', () => {
			setKeyboardStatus((prevStatus) => {
				const newStatus = prevStatus === 0 ? 1 : 0;
				console.log(`Keyboard toggle triggered, status set to: ${newStatus}`);
				return newStatus;
			});
		});

		return () => {
			console.log('Cleaning up keyboard listeners');
			toggleSubscription.remove();
		};
	}, []);

	return (
		<Tab.Navigator
			testID="navBar"
			initialRouteName={'Central'}
			screenOptions={{
				tabBarActiveTintColor: 'black',
				tabBarActiveBackgroundColor: tailwindConfig.theme.colors.cyanBlue,
				tabBarLabelStyle: {
					fontSize: keyboardStatus === 1 ? 0 : 14, // Hide text when keyboard is open
				},
				tabBarStyle: {
					backgroundColor: 'white',
					height: '10%',
					paddingBottom: '2%',
					...Platform.select({
						ios: {
							paddingVertical: '2%',
							paddingHorizontal: '4%',
							paddingBottom: '6%',
							shadowColor: 'rgba(0, 0, 0, 0.2)',
							shadowOffset: {
								width: 0,
								height: 1,
							},
							shadowOpacity: 0.8,
							shadowRadius: 8,
						},
						android: {
							paddingVertical: '4%',
							paddingHorizontal: '4%',
							paddingBottom: '2%',
							elevation: 4,
						},
					}),
				},
				tabBarItemStyle: {
					borderRadius: 15,
					marginHorizontal: '0%',
					paddingBottom: '2%',
					paddingTop: '1%',
				},
			}}
		>
			<Tab.Screen
				name="Meus cursos"
				component={CoursesStackComponent}
				options={{
					tabBarActiveBackgroundColor: tailwindConfig.theme.colors.cyanBlue,
					headerShown: false,
					tabBarIcon: ({ color }) => (
						<Icon
							size={25}
							name="home-outline"
							type="material-community"
							color={color}
						/>
					),
					tabBarActiveTintColor: 'white',
					tabBarInactiveTintColor: 'grey',
				}}
			/>
			<Tab.Screen
				name="Explorar"
				component={ExploreComponent}
				options={{
					tabBarActiveBackgroundColor: tailwindConfig.theme.colors.cyanBlue,
					headerShown: false,
					tabBarIcon: ({ color }) => (
						<Icon
							size={25}
							name="compass-outline"
							type="material-community"
							color={color}
						/>
					),
					tabBarActiveTintColor: 'white',
					tabBarInactiveTintColor: 'grey',
				}}
			/>
			<Tab.Screen
				name="Edu"
				component={EduComponent}
				options={{
					tabBarActiveBackgroundColor: tailwindConfig.theme.colors.cyanBlue,
					headerShown: false,
					tabBarIcon: ({ color }) => (
						<Icon
							size={25}
							name="robot-outline"
							type="material-community"
							color={color}
						/>
					),
					tabBarActiveTintColor: 'white',
					tabBarInactiveTintColor: 'grey',
				}}
			/>
			<Tab.Screen
				name="Perfil"
				component={ProfileStackComponent}
				options={{
					tabBarActiveBackgroundColor: tailwindConfig.theme.colors.cyanBlue,
					headerShown: false,
					tabBarIcon: ({ color }) => (
						<Icon
							size={34}
							name="account-outline"
							type="material-community"
							color={color}
						/>
					),
					tabBarActiveTintColor: 'white',
					tabBarInactiveTintColor: 'grey',
				}}
			/>
		</Tab.Navigator>
	);
}
