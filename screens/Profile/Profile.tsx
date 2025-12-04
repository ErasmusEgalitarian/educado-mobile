// We need useCallback to use with useFocusEffect
// eslint-disable-next-line no-restricted-imports
import { useCallback } from "react";
import { ToastNotification } from "@/components/General/ToastNotification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View } from "react-native";
import LogOutButton from "@/components/Profile/LogOutButton";
import ProfileNavigationButton from "@/components/Profile/ProfileNavigationButton";
import UserInfo from "@/components/Profile/UserInfo";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import errorSwitch from "@/components/General/error-switch";
import ShowAlert from "@/components/General/ShowAlert";
import ProfileStatsBox from "@/components/Profile/ProfileStatsBox";
import Tooltip from "@/components/Onboarding/Tooltip";
import { useLoginStudent, useStudent } from "@/hooks/query";
import { t } from "@/i18n";
import { AlertNotificationRoot } from "react-native-alert-notification";

const Profile = () => {
  const navigation = useNavigation();

  // const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const localStudentQuery = useLoginStudent();
  const localStudent = localStudentQuery.data;

  const studentQuery = useStudent(localStudent.userInfo.id);

  if (localStudentQuery.isError || studentQuery.isError) {
    ShowAlert(errorSwitch(localStudentQuery.error ?? studentQuery.error));
  }

  useFocusEffect(
    useCallback(() => {
      const onPasswordReset = async () => {
        try {
          if ((await AsyncStorage.getItem("passwordUpdated")) === "true") {
            ToastNotification("success", t("profile.change-password-success"));

            await AsyncStorage.setItem("passwordUpdated", "false");
          }
        } catch (error) {
          console.error("Error updating password", error);
        }
      };

      void onPasswordReset();
    }, []),
  );

  return (
    <AlertNotificationRoot>
      <View className="flex flex-col bg-surfaceSubtleGrayscale px-[5%] pb-[5%] pt-[20%]">
        <UserInfo
          firstName={localStudent.userInfo.firstName}
          lastName={localStudent.userInfo.lastName}
          email={localStudent.userInfo.email}
          photo={studentQuery.data?.photo}
        />
        <ProfileStatsBox
          studyStreak={studentQuery.data?.studyStreak ?? 0}
          points={studentQuery.data?.points ?? 0}
          leaderboardPosition={0}
          level={studentQuery.data?.level ?? 0}
        />
        <Tooltip
          position={{
            top: 190,
            left: 100,
          }}
          tailSide="right"
          tailPosition={12}
          tooltipKey="Profile"
          uniCodeIcon="👩‍🏫"
        >
          {t("profile.tooltip")}
        </Tooltip>
        <ProfileNavigationButton
          label={t("profile.edit-profile")}
          testId={"editProfileNav"}
          onPress={() => {
            // @ts-expect-error The error will disappear when we migrate to Expo Router
            navigation.navigate("EditProfile");
          }}
        />
        <ProfileNavigationButton
          label={t("profile.leaderboard")}
          onPress={() => {
            // @ts-expect-error The error will disappear when we migrate to Expo Router
            navigation.navigate("LeaderboardStack");
          }}
        />
        <ProfileNavigationButton
          label={t("profile.certificates")}
          onPress={() => {
            // @ts-expect-error The error will disappear when we migrate to Expo Router
            navigation.navigate("Certificate");
          }}
        />
        {/* Download page is not implemented yet. However, download works and can be accessed on home page when offline */}
        <ProfileNavigationButton
          label={t("profile.download")}
          onPress={() => {
            // @ts-expect-error The error will disappear when we migrate to Expo Router
            navigation.navigate("Download");
          }}
        />
        <ProfileNavigationButton
          label={t("profile.change-password")}
          testId={"editPasswordNav"}
          onPress={() => {
            // @ts-expect-error The error will disappear when we migrate to Expo Router
            navigation.navigate("EditPassword");
          }}
        />
        <LogOutButton testID="logoutBtn" />
      </View>
    </AlertNotificationRoot>
  );
};

export default Profile;
