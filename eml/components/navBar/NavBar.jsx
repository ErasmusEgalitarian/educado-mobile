import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CourseScreen from '../../screens/courses/CourseScreen';
import Explore from '../../screens/explore/Explore';
import ProfileComponent from '../../screens/profile/Profile';
import { Icon } from '@rneui/themed';
import { Platform, Text } from 'react-native';
import tailwindConfig from '../../tailwind.config';

const Tab = createBottomTabNavigator();
const colors = tailwindConfig.theme.colors;

/**
 * This component is used to display the navigation bar at the bottom of the screen.
 * @returns {JSX.Element} - Returns a JSX element.
 */
export default function NavBar() {

	return (
		<Tab.Navigator
			testID="navBar" // Make sure you set the testID on the correct element
			initialRouteName={'Central'}
			screenOptions={({ route }) => ({
				tabBarActiveTintColor: colors.primary,
				tabBarInactiveTintColor: colors.grayMedium,
				tabBarLabel: ({ focused, color }) => (
					<Text style={{ fontFamily: focused ? 'Montserrat-Bold' : 'Montserrat-Regular', fontSize: 14, color }}>
						{route.name}
					</Text>
				),

				tabBarStyle: {
					backgroundColor: 'white',
					height: '10%',
					paddingBottom: '2%',

					// THIS IS SHADOW STUFF - HAVE TO BE PLATFORM SPECIFIC
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
							elevation: 4, // Add elevation for the shadow (Android-specific)
						},
					}),
				},
				tabBarItemStyle: {
					borderRadius: 15,
					marginHorizontal: '2%', // Adjust the margin for spacing
					paddingBottom: '2%', // Vertical padding for the icon
					paddingTop: '1%', // Vertical padding for the icon
				},
			})}
		>
			<Tab.Screen
				name="Meus cursos"
				component={CourseScreen}
				options={{
					headerShown: false,
					tabBarIcon: ({ color }) => ( // Pass the color as a parameter to the icon component
						<Icon
							size={17}
							name="home-outline"
							type="material-community"
							color={color} // Use the color parameter here
						/>
					),
				}}
			/>
			<Tab.Screen
				name="Explorar"
				component={Explore}
				options={{
					headerShown: false,
					tabBarIcon: ({ color }) => ( // Pass the color as a parameter to the icon component
						<Icon
							size={17}
							name="compass-outline"
							type="material-community"
							color={color} // Use the color parameter here
						/>
					),
				}}
			/>
			<Tab.Screen
				name="Perfil"
				component={ProfileComponent}
				options={{
					headerShown: false,
					tabBarIcon: ({ color }) => ( // Pass the color as a parameter to the icon component
						<Icon
							size={17}
							name="account-outline"
							type="material-community"
							color={color} // Use the color parameter here
						/>
					),
				}}
			/>
		</Tab.Navigator>
	);
}
