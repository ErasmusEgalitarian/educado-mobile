import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/login/Login';
import RegisterScreen from './screens/register/Register';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExerciseScreen from './screens/excercise/ExerciseScreen';
import { TailwindProvider } from 'tailwindcss-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CourseOverviewScreen from './screens/courses/CourseOverviewScreen';
import SectionScreen from './screens/section/SectionScreen';
import LoadingScreen from './components/loading/Loading';
import WelcomeScreen from './screens/welcome/Welcome';
import CompleteSectionScreen from './screens/section/CompleteSection';
import NavBar from './components/navBar/NavBar';
import CourseScreen from './screens/courses/CourseScreen';
import EditProfileScreen from './screens/profile/EditProfile';
import DownloadScreen from './screens/download/DownloadScreen';
import CertificateScreen from './screens/certificate/CertificateScreen';
import CompleteCourseScreen from './screens/courses/CompleteCourse';
import CameraScreen from './screens/camera/CameraScreen';
import BaseScreen from './components/general/BaseScreen';
import LeaderboardScreen from './screens/leaderboard/Leaderboard';
import SubscribedToCourseScreen from './screens/courses/SubscribedToCourseScreen';
import { DownloadProvider } from './services/DownloadService';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import Explore from './screens/explore/Explore';
import Edu from './screens/eduChatbot/EduScreen';

const Stack = createNativeStackNavigator();

function LeaderboardStack() {
	return (
		<Stack.Navigator initialRouteName={'Leaderboard'}>
			<Stack.Screen
				name="Leaderboard"
				component={LeaderboardScreen}
				options={{
					headerShown: false,
				}}
			/>
		</Stack.Navigator>
	);
}

function WelcomeStack() {
	return (
		<Stack.Navigator initialRouteName={'Welcome'}>
			<Stack.Screen
				name="Welcome"
				component={WelcomeScreen}
				options={{
					headerShown: false,
				}}
			/>
		</Stack.Navigator>
	);
}

function LoginStack() {
	return (
		<Stack.Navigator initialRouteName={'Login'}>
			<Stack.Screen
				name="Login"
				component={LoginScreen}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="Register"
				component={RegisterScreen}
				options={{
					headerShown: false,
				}}
			/>
		</Stack.Navigator>
	);
}

const TabInnerStack = createNativeStackNavigator();

const ProfileStackScreen = () => {
	return (
		<TabInnerStack.Navigator initialRouteName="ProfileHome">
			{/*<TabInnerStack.Screen name="ProfileHome" component={ProfileComponent} options={{ headerShown: false }} />*/}
			<TabInnerStack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: false }} />
			<TabInnerStack.Screen name="Certificate" component={CertificateScreen} options={{ headerShown: false }} />
			<TabInnerStack.Screen name="Download" component={DownloadScreen} options={{ headerShown: false }} />
		</TabInnerStack.Navigator>
	);
};

const CoursesStackScreen = () => {
	return (
		<TabInnerStack.Navigator initialRouteName="CoursesHome">
			<TabInnerStack.Screen name="CoursesHome" component={CourseScreen} options={{ headerShown: false }} />
			<TabInnerStack.Screen name="CourseOverview" component={CourseOverviewScreen} options={{ headerShown: false }} />
			<TabInnerStack.Screen name="Section" component={SectionScreen} options={{ headerShown: false }} />
			<TabInnerStack.Screen name="Exercise" component={ExerciseScreen} options={{ headerShown: false }} />
			<TabInnerStack.Screen name="CompleteSection" component={CompleteSectionScreen} options={{ headerShown: false }} />
			<TabInnerStack.Screen name="CompleteCourse" component={CompleteCourseScreen} options={{ headerShown: false }} />
			<TabInnerStack.Screen name="Subscribed" component={SubscribedToCourseScreen} options={{ headerShown: false }} />
			<TabInnerStack.Screen name="Camera" component={CameraScreen} options={{ headerShown: false }} />
		</TabInnerStack.Navigator>
	);
};

export function useWelcomeScreenLogic(loadingTime, onResult) {

	setTimeout(() => {
		const fetchData = async () => {
			try {
				const value = await AsyncStorage.getItem('hasShownWelcome');
				let initialRoute = 'WelcomeStack';
				let isLoading = true;

				if (value === 'true') {
					initialRoute = 'LoginStack';
				} else {
					await AsyncStorage.setItem('hasShownWelcome', 'true');
				}

				// Pass the results to the callback
				isLoading = false;
				onResult(initialRoute, isLoading);
			} catch (error) {
				console.error('Error retrieving or setting AsyncStorage data:', error);
			}
		};

		fetchData();
	}, loadingTime);

}

export default function App() {
	const [fontsLoaded, setFontsLoaded] = useState(false);
	const [initialRoute, setInitialRoute] = useState('');
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function loadFonts() {
			await Font.loadAsync({
				'Montserrat-Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
				'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf'),
				'Montserrat-SemiBold': require('./assets/fonts/Montserrat-SemiBold.ttf'),
			});
			setFontsLoaded(true);
		}
		loadFonts();
	}, []);

	useEffect(() => {
		async function prepare() {
			if (!fontsLoaded) {
				await SplashScreen.preventAutoHideAsync();
			} else {
				await SplashScreen.hideAsync();
			}
		}
		prepare();
	}, [fontsLoaded]);

	// Callback function to handle the results
	const handleResult = (route, loading) => {
		setInitialRoute(route);
		setIsLoading(loading);
	};

	useWelcomeScreenLogic(3000, handleResult);

	// ************** Don't touch this code **************
	if (!fontsLoaded) {
		return null;
	}

	// Makes sure fonts are loaded before rendering the app
	if (isLoading && fontsLoaded) {
		return <LoadingScreen />;
	}
	// ***************************************************

	return (
		<TailwindProvider>
			<BaseScreen>
				<IconRegistry icons={EvaIconsPack} />
				<ApplicationProvider {...eva} theme={eva.light}>
					<DownloadProvider>
						<NavigationContainer>
							<Stack.Navigator initialRouteName={initialRoute}>
								<Stack.Screen
									name="LeaderboardStack"
									component={LeaderboardStack}
									options={{ headerShown: false }}
								/>
								<Stack.Screen
									name="WelcomeStack"
									component={WelcomeStack}
									options={{ headerShown: false }}
								/>
								<Stack.Screen
									name="LoginStack"
									component={LoginStack}
									options={{ headerShown: false }}
								/>
								<Stack.Screen
									name="HomeStack"
									options={{ headerShown: false }}
									children={() => (
										<NavBar
											CoursesStackComponent={CoursesStackScreen}
											ProfileStackComponent={ProfileStackScreen}
											ExploreComponent={Explore}
											EduComponent={Edu}
										/>
									)}
								/>
							</Stack.Navigator>
						</NavigationContainer>
					</DownloadProvider>
				</ApplicationProvider>
			</BaseScreen>
		</TailwindProvider>
	);
}
