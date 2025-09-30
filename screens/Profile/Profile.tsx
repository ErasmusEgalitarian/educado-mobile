import { useEffect, useState, useCallback } from "react";
import ToastNotification from "../../components/General/ToastNotification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View } from "react-native";
import LogOutButton from "../../components/Profile/LogOutButton";
import ProfileNavigationButton from "../../components/Profile/ProfileNavigationButton";
import UserInfo from "../../components/Profile/UserInfo";
import { useNavigation } from "@react-navigation/native";
import NetworkStatusObserver from "../../hooks/NetworkStatusObserver";
import { getUserInfo, getStudentInfo } from "../../services/storage-service";
import errorSwitch from "../../components/General/error-switch";
import ShowAlert from "../../components/General/ShowAlert";
import ProfileStatsBox from "../../components/Profile/ProfileStatsBox";
import { useFocusEffect } from "@react-navigation/native";
import Tooltip from "../../components/Onboarding/Tooltip";
import OfflineScreen from "../Offline/OfflineScreen";
/**
 * Profile screen
 * @returns {React.Element} Component for the profile screen
 */
export default function ProfileComponent() {
  const [isOnline, setIsOnline] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  const navigation = useNavigation();
  const [studentLevel, setStudentLevel] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [studyStreak, setStudyStreak] = useState(0); // Number of days in a row with study activity
  const [leaderboardPosition, setLeaderboardPosition] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const getInfo = navigation.addListener("focus", () => {
      getProfile();
    });
    return getInfo;
  }, [navigation]);

  /**
   * Fetches the user's profile from local storage
   */
  const getProfile = async () => {
    try {
      const fetchedProfile = await getUserInfo();
      const fetchedStudent = await getStudentInfo();

      if (fetchedProfile !== null) {
        setFirstName(fetchedProfile.firstName);
        setLastName(fetchedProfile.lastName);
        setEmail(fetchedProfile.email);

        if (fetchedStudent !== null) setPhoto(fetchedStudent.photo);
      }

      if (fetchedStudent !== null) {
        setStudentLevel(fetchedStudent.level);
        setTotalPoints(fetchedStudent.points);
        setStudyStreak(fetchedStudent.studyStreak);
        setLeaderboardPosition(0); // 0 is a placeholder for now
      }
    } catch (error) {
      ShowAlert(errorSwitch(error));
    }
  };

  useFocusEffect(
    useCallback(() => {
      console.log("Profile screen focused");
      const runAsyncFunction = async () => {
        try {
          // Load profile data and check for password reset status
          await getProfile();
          await checkPasswordReset();
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      };

      // Run the async function when the screen is focused
      runAsyncFunction();
    }, []),
  );

  const checkPasswordReset = async () => {
    try {
      console.log("Checking password reset");
      if ((await AsyncStorage.getItem("passwordUpdated")) == "true") {
        ToastNotification("success", "Senha alterada com sucesso");
        await AsyncStorage.setItem("passwordUpdated", "false");
        return;
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <NetworkStatusObserver setIsOnline={setIsOnline} />
      {!isOnline ? (
        <OfflineScreen />
      ) : (
        <View className="flex flex-col bg-secondary px-[5%] pt-[20%] pb-[5%]">
          <UserInfo
            firstName={firstName}
            lastName={lastName}
            email={email}
            photo={photo}
          ></UserInfo>
          <ProfileStatsBox
            studyStreak={studyStreak || 0}
            points={totalPoints || 0}
            leaderboardPosition={leaderboardPosition || 0}
            level={studentLevel || 0}
            drawProgressBarOnly={false}
          />
          <Tooltip
            isVisible={isVisible}
            position={{
              top: -300,
              left: 70,
              right: 30,
              bottom: 24,
            }}
            setIsVisible={setIsVisible}
            text={
              "Você está no seu perfil, onde pode acessar suas informações, visualizar certificados e realizar outras atividades."
            }
            tailSide="right"
            tailPosition="20%"
            uniqueKey="Profile"
            uniCodeChar="👩‍🏫"
          />

          <ProfileNavigationButton
            label="Editar perfil"
            testId={"editProfileNav"}
            onPress={() => navigation.navigate("EditProfile")}
          ></ProfileNavigationButton>
          <ProfileNavigationButton
            label="Tabela de classificação"
            onPress={() => navigation.navigate("LeaderboardStack")}
          ></ProfileNavigationButton>
          <ProfileNavigationButton
            label="Certificados"
            onPress={() => navigation.navigate("Certificate")}
          ></ProfileNavigationButton>

          {/* Download page is not implemented yet. However, download works and can be accessed on home page when offline */}
          <ProfileNavigationButton
            label="Download"
            onPress={() => navigation.navigate("Download")}
          ></ProfileNavigationButton>
          <ProfileNavigationButton
            label="Alterar senha"
            testId={"editPasswordNav"}
            onPress={() => navigation.navigate("EditPassword")}
          ></ProfileNavigationButton>
          <LogOutButton testID="logoutBtn"></LogOutButton>
        </View>
      )}
    </>
  );
}
