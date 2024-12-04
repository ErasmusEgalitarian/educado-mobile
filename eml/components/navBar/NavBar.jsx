import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CourseScreen from '../../screens/courses/CourseScreen';
import Explore from '../../screens/explore/Explore';
import ProfileComponent from '../../screens/profile/Profile';
import EditProfile from '../../screens/profile/EditProfile';
import CertificateScreen from '../../screens/certificate/CertificateScreen';
import { Icon } from '@rneui/themed';
import { Platform } from 'react-native';
import tailwindConfig from '../../tailwind.config';

const Tab = createBottomTabNavigator();

const ProfileStack = createNativeStackNavigator();

function ProfileStackScreen() {
	
	return (
		<ProfileStack.Navigator initialRouteName='ProfileHome'>
			<ProfileStack.Screen
				name="ProfileHome"
				component={ProfileComponent}
				options={{
					headerShown: false,
				}}
			/>
			<ProfileStack.Screen
				name="EditProfile"
				component={EditProfile}
				options={{
					headerShown: false,
				}}
			/>
			<ProfileStack.Screen
				name="Certificate"
				component={CertificateScreen}
				options={{
					headerShown: false,
				}}
			/>
		</ProfileStack.Navigator>
	);
}

/**
 * This component is used to display the navigation bar at the bottom of the screen.
 * @returns {JSX.Element} - Returns a JSX element.
 * 
 * 
 */
export default function NavBar() {

	return (
		<Tab.Navigator
			testID="navBar" // Make sure you set the testID on the correct element
			initialRouteName={'Central'}
			screenOptions={{
				tabBarActiveTintColor: 'black',
				tabBarActiveBackgroundColor: tailwindConfig.theme.colors.cyanBlue,
				tabBarLabelStyle: {
					fontSize: 14,
				},

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
			}}
		>
			<Tab.Screen
				name="Meus cursos"
				component={CourseScreen}
				options={{
					tabBarActiveBackgroundColor: tailwindConfig.theme.colors.cyanBlue,
					headerShown: false,
					tabBarIcon: ({ color }) => ( // Pass the color as a parameter to the icon component
						<Icon
							size={25}
							name="home-outline"
							type="material-community"
							color={color} // Use the color parameter here
						/>
					),
					tabBarActiveTintColor: 'white', // Set the active text color to white
					tabBarInactiveTintColor: 'grey', // Set the inactive text color to grey
				}}
			/>
			<Tab.Screen
				name="Explorar"
				component={Explore}
				options={{
					tabBarActiveBackgroundColor: tailwindConfig.theme.colors.cyanBlue,
					headerShown: false,
					tabBarIcon: ({ color }) => ( // Pass the color as a parameter to the icon component
						<Icon
							size={25}
							name="compass-outline"
							type="material-community"
							color={color} // Use the color parameter here
						/>
					),
					tabBarActiveTintColor: 'white', // Set the active text color to white
					tabBarInactiveTintColor: 'grey', // Set the inactive text color to grey
				}}
			/>
			<Tab.Screen
				name="Perfil"
				component={ProfileStackScreen}
				options={{
					tabBarActiveBackgroundColor: tailwindConfig.theme.colors.cyanBlue,
					headerShown: false,
					tabBarIcon: ({ color }) => ( // Pass the color as a parameter to the icon component
						<Icon
							size={34}
							name="account-outline"
							type="material-community"
							color={color} // Use the color parameter here
						/>
					),
					tabBarActiveTintColor: 'white', // Set the active text color to white
					tabBarInactiveTintColor: 'grey', // Set the inactive text color to grey
				}}
			/>
		</Tab.Navigator>
	);
}
