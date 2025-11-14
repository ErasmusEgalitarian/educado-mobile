import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CourseScreen from "@/app/screens/Courses/CourseScreen";
import DownloadScreen from "@/app/screens/Download/DownloadScreen";
import ExploreScreen from "@/app/screens/Explore/ExploreScreen";
import EduScreen from "@/app/screens/EduChatbot/EduScreen";
import Profile from "@/app/screens/Profile/Profile";
import EditProfileScreen from "@/app/screens/Profile/EditProfileScreen";
import CertificateScreen from "@/app/screens/Certificate/CertificateScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Platform, Text } from "react-native";
import { colors } from "@/theme/colors";

const Tab = createBottomTabNavigator();
const ProfileStack = createNativeStackNavigator();

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

/**
 * This component is used to display the navigation bar at the bottom of the screen.
 * @returns - Returns a JSX element.
 */
export const NavigationBar = () => {
  return (
    <Tab.Navigator
      initialRouteName={"Meus cursos"}
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.surfaceDarker,
        tabBarInactiveTintColor: colors.surfaceDefaultGrayscale,
        tabBarLabel: ({ focused, color }) => (
          <Text
            className={
              focused ? "text-caption-lg-bold" : "text-caption-lg-regular"
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
          ...Platform.select({
            ios: {
              paddingVertical: "2%",
              paddingHorizontal: "4%",
              paddingBottom: "6%",
              shadowColor: "rgba(0, 0, 0, 0.2)",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.8,
              shadowRadius: 8,
            },
            android: {
              paddingVertical: "4%",
              paddingHorizontal: "4%",
              paddingBottom: "2%",
              elevation: 4,
            },
          }),
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
        component={CourseScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              size={25}
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
              size={25}
              name="compass-outline"
              type="material-community"
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Edu"
        component={EduScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              size={25}
              name="robot-outline"
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
              size={34}
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
