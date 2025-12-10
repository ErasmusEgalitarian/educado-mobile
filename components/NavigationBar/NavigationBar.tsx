import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CourseScreen from "@/app/screens/Courses/CourseScreen";
import CourseOverviewScreen from "@/app/screens/Courses/CourseOverviewScreen";
import DownloadScreen from "@/app/screens/Download/DownloadScreen";
import ExploreScreen from "@/app/screens/Explore/ExploreScreen";
import Profile from "@/app/screens/Profile/Profile";
import EditProfileScreen from "@/app/screens/Profile/EditProfileScreen";
import CertificateScreen from "@/app/screens/Certificate/CertificateScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "react-native";
import { colors } from "@/theme/colors";

const Tab = createBottomTabNavigator();
const ProfileStack = createNativeStackNavigator();
const CourseStack = createNativeStackNavigator();

const ProfileStackScreen = () => {
  return (
    <ProfileStack.Navigator initialRouteName="ProfileHome">
      <ProfileStack.Screen
        name="ProfileHome"
        component={Profile}
        options={{
          headerShown: false,
        }}
      />
      <ProfileStack.Screen
        name="EditProfile"
        component={EditProfileScreen}
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
      <ProfileStack.Screen
        name="Download"
        component={DownloadScreen}
        options={{
          headerShown: false,
        }}
      />
    </ProfileStack.Navigator>
  );
};

const CourseStackScreen = () => {
  return (
    <CourseStack.Navigator initialRouteName="Courses">
      <CourseStack.Screen
        name="Courses"
        component={CourseScreen}
        options={{
          headerShown: false,
        }}
      />
      <CourseStack.Screen
        name="CourseOverview"
        // @ts-expect-error TODO It's bad practice to suppress the error here, but it's necessary for now.
        // We will migrate the screens to Expo Router shortly anyway, which makes fixing it now redundant.
        component={CourseOverviewScreen}
        options={{
          headerShown: false,
        }}
      />
    </CourseStack.Navigator>
  );
};

/**
 * This component is used to display the navigation bar at the bottom of the screen.
 * @returns - Returns a JSX element.
 */
export const NavigationBar = () => {
  return (
    <Tab.Navigator
      initialRouteName={"Meus cursos"}
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.textLabelCyan,
        tabBarInactiveTintColor: colors.projectGray,
        tabBarLabel: ({ focused, color }) => (
          <Text
            className={
              focused ? "text-caption-lg-semibold" : "text-caption-lg-regular"
            }
            style={{ color }}
          >
            {route.name}
          </Text>
        ),
        tabBarStyle: {
          backgroundColor: "white",
          height: "10%",
          paddingBottom: "2%",
          paddingVertical: "4%",
          paddingHorizontal: "4%",
          elevation: 4,
        },
        tabBarItemStyle: {
          borderRadius: 15,
          marginHorizontal: "0%",
          paddingBottom: "2%",
          paddingTop: "1%",
        },
      })}
    >
      <Tab.Screen
        name="Meus cursos"
        component={CourseStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              size={20}
              name="home-outline"
              type="material-community"
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Explorar"
        component={ExploreScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              size={20}
              name="compass-outline"
              type="material-community"
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              size={20}
              name="account-outline"
              type="material-community"
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default NavigationBar;
