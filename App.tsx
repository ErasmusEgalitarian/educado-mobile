import { useState } from "react";
import LoginScreen from "@/app/screens/Login/LoginScreen";
import RegisterScreen from "@/app/screens/Registration/RegistrationScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ExerciseScreen from "@/app/screens/Excercises/ExerciseScreen";
import CourseOverviewScreen from "@/app/screens/Courses/CourseOverviewScreen";
import SectionScreen from "@/app/screens/Section/SectionScreen";
import LoadingScreen from "@/components/Loading/LoadingScreen";
import WelcomeScreen from "@/app/screens/Welcome/WelcomeScreen";
import CompleteSectionScreen from "@/app/screens/Section/CompleteSectionScreen";
import { NavigationBar } from "@/components/NavigationBar/NavigationBar";
import ComponentSwipeScreen from "@/app/screens/Lectures/ComponentSwipeScreen";
import ErrorScreen from "@/app/screens/Errors/ErrorScreen";
import CourseScreen from "@/app/screens/Courses/CourseScreen";
import EditProfileScreen from "@/app/screens/Profile/EditProfileScreen";
import EditPasswordScreen from "@/app/screens/Profile/EditPasswordScreen";
import DownloadScreen from "@/app/screens/Download/DownloadScreen";
import CertificateScreen from "@/app/screens/Certificate/CertificateScreen";
import CompleteCourseScreen from "@/app/screens/Courses/CompleteCourseScreen";
import CameraScreen from "@/app/screens/Camera/CameraScreen";
import LeaderboardScreen from "@/app/screens/Leaderboard/LeaderboardScreen";
import SubscribedToCourseScreen from "@/app/screens/Courses/SubscribedToCourseScreen";

import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_400Regular_Italic,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_600SemiBold_Italic,
  Montserrat_700Bold,
  Montserrat_700Bold_Italic,
  Montserrat_800ExtraBold,
} from "@expo-google-fonts/montserrat";

const Stack = createNativeStackNavigator();

const LeaderboardStack = () => (
  <Stack.Navigator initialRouteName={"Leaderboard"}>
    <Stack.Screen
      name="Leaderboard"
      component={LeaderboardScreen}
      options={{
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

const WelcomeStack = () => (
  <Stack.Navigator initialRouteName={"Welcome"}>
    <Stack.Screen
      name="Welcome"
      component={WelcomeScreen}
      options={{
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

const LoginStack = () => (
  <Stack.Navigator initialRouteName={"Login"}>
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

const CertificateStack = () => (
  <Stack.Navigator initialRouteName={"Certificate"}>
    <Stack.Screen
      name="Certificate"
      component={CertificateScreen}
      options={{
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

const CourseStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Course"
      component={CourseScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="CompleteSection"
      component={CompleteSectionScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="Exercise"
      // @ts-expect-error TODO It's bad practice to suppress the error here, but it's necessary for now.
      // We will migrate the screens to Expo Router shortly anyway, which makes fixing it now redundant.
      component={ExerciseScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="CourseOverview"
      // @ts-expect-error TODO It's bad practice to suppress the error here, but it's necessary for now.
      // We will migrate the screens to Expo Router shortly anyway, which makes fixing it now redundant.
      component={CourseOverviewScreen}
      initialParams={{ course: {} }}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Section"
      // @ts-expect-error TODO It's bad practice to suppress the error here, but it's necessary for now.
      // We will migrate the screens to Expo Router shortly anyway, which makes fixing it now redundant.
      component={SectionScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ErrorScreen"
      component={ErrorScreen}
      options={{
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

export const useWelcomeScreenLogic = (
  loadingTime: number,
  onResult: (route: string, loading: boolean) => void,
) => {
  setTimeout(() => {
    const fetchData = async () => {
      try {
        const value = await AsyncStorage.getItem("hasShownWelcome");
        let initialRoute = "WelcomeStack";
        let isLoading = true;

        if (value === "true") {
          initialRoute = "LoginStack";
        } else {
          await AsyncStorage.setItem("hasShownWelcome", "true");
        }

        // Pass the results to the callback
        isLoading = false;
        onResult(initialRoute, isLoading);
      } catch (error) {
        console.error("Error retrieving or setting AsyncStorage data:", error);
      }
    };

    void fetchData();
  }, loadingTime);
};

export const App = () => {
  const [initialRoute, setInitialRoute] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_400Regular_Italic,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_600SemiBold_Italic,
    Montserrat_700Bold,
    Montserrat_700Bold_Italic,
    Montserrat_800ExtraBold,
  });

  // Callback function to handle the results
  const handleResult = (route: string, loading: boolean) => {
    setInitialRoute(route);
    setIsLoading(loading);
  };

  useWelcomeScreenLogic(3000, handleResult);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
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
        component={NavigationBar}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={"CourseStack"}
        component={CourseStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={"CourseOverview"}
        // @ts-expect-error TODO It's bad practice to suppress the error here, but it's necessary for now.
        // We will migrate the screens to Expo Router shortly anyway, which makes fixing it now redundant.
        component={CourseOverviewScreen}
        initialParams={{ course: {} }}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={"Section"}
        // @ts-expect-error TODO It's bad practice to suppress the error here, but it's necessary for now.
        // We will migrate the screens to Expo Router shortly anyway, which makes fixing it now redundant.
        component={SectionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={"CompleteSection"}
        component={CompleteSectionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={"Download"}
        component={DownloadScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditPassword"
        component={EditPasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Exercise"
        // @ts-expect-error TODO It's bad practice to suppress the error here, but it's necessary for now.
        // We will migrate the screens to Expo Router shortly anyway, which makes fixing it now redundant.
        component={ExerciseScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Components"
        // @ts-expect-error TODO It's bad practice to suppress the error here, but it's necessary for now.
        // We will migrate the screens to Expo Router shortly anyway, which makes fixing it now redundant.
        component={ComponentSwipeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CertificateStack"
        component={CertificateStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CompleteCourse"
        component={CompleteCourseScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Subscribed"
        component={SubscribedToCourseScreen}
        initialParams={{ course_id: "" }}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
