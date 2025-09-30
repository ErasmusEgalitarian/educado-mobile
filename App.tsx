import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/Login/LoginScreen";
import RegisterScreen from "./screens/Registration/RegistrationScreen";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ExerciseScreen from "./screens/Excercises/ExerciseScreen";
import { TailwindProvider } from "tailwindcss-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CourseOverviewScreen from "./screens/Courses/CourseOverviewScreen";
import SectionScreen from "./screens/Section/SectionScreen";
import LoadingScreen from "./components/Loading/LoadingScreen";
import WelcomeScreen from "./screens/Welcome/WelcomeScreen";
import CompleteSectionScreen from "./screens/Section/CompleteSectionScreen";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import ComponentSwipeScreen from "./screens/Lectures/ComponentSwipeScreen";
import ErrorScreen from "./screens/Errors/ErrorScreen";
import CourseScreen from "./screens/Courses/CourseScreen";
import EditProfileScreen from "./screens/Profile/EditProfileScreen";
import EditPasswordScreen from "./screens/Profile/EditPasswordScreen";
import DownloadScreen from "./screens/Download/DownloadScreen";
import CertificateScreen from "./screens/Certificate/CertificateScreen";
import CompleteCourseScreen from "./screens/Courses/CompleteCourseScreen";
import CameraScreen from "./screens/Camera/CameraScreen";
import BaseScreen from "./components/General/BaseScreen";
import LeaderboardScreen from "./screens/Leaderboard/LeaderboardScreen";
import SubscribedToCourseScreen from "./screens/Courses/SubscribedToCourseScreen";
import { DownloadProvider } from "./services/DownloadProvider";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Stack = createNativeStackNavigator();

function LeaderboardStack() {
  return (
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
}

function WelcomeStack() {
  return (
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
}

function LoginStack() {
  return (
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
}

function CertificateStack() {
  return (
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
}

function CourseStack() {
  return (
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
        component={ExerciseScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CourseOverview"
        component={CourseOverviewScreen}
        initialParams={{ course_id: "" }}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Section"
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
}

export function useWelcomeScreenLogic(loadingTime, onResult) {
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

    fetchData();
  }, loadingTime);
}

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [initialRoute, setInitialRoute] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "Montserrat-Regular": require("./assets/fonts/Montserrat-Regular.ttf"),
        "Montserrat-Bold": require("./assets/fonts/Montserrat-Bold.ttf"),
        "Montserrat-SemiBold": require("./assets/fonts/Montserrat-SemiBold.ttf"),
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
    <GestureHandlerRootView style={{ flex: 1 }}>
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
                    component={CourseOverviewScreen}
                    initialParams={{ course_id: "" }}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name={"Section"}
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
                    component={ExerciseScreen}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="Components"
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
              </NavigationContainer>
            </DownloadProvider>
          </ApplicationProvider>
        </BaseScreen>
      </TailwindProvider>
    </GestureHandlerRootView>
  );
}
