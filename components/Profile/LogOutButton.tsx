import { View, TouchableOpacity, Alert, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLogoutStrapi } from "@/hooks/query";
import { colors } from "@/theme/colors";

const LOGIN_TOKEN = "@loginToken";
const USER_INFO = "@userInfo";
const STUDENT_INFO = "@studentInfo";

export default function LogOutButton(props: { testID: string }) {
  const navigation = useNavigation();
  const logoutStrapi = useLogoutStrapi();

  const logOut = async () => {
    try {
      await AsyncStorage.removeItem(LOGIN_TOKEN);
      await AsyncStorage.removeItem(USER_INFO);
      await AsyncStorage.removeItem(STUDENT_INFO);

      await logoutStrapi.mutateAsync();

      navigation.navigate("LoginStack" as never);
    } catch (e) {
      console.log(e);
    }
  };

  const logoutAlert = () => {
    Alert.alert("Sair", "Tem certeza que deseja sair?", [
      {
        text: "Não",
        onPress: () => {
          console.log("No Pressed");
        },
        style: "cancel",
      },
      { text: "Sim", onPress: () => void logOut() },
    ]);
  };

  return (
    <View className="flex items-center py-[6%]">
      <TouchableOpacity onPress={logoutAlert}>
        <View className="flex flex-row items-center">
          <MaterialCommunityIcons
            name="logout"
            size={30}
            color={colors.error}
            testID={props.testID}
          />
          <Text className="text-center text-surfaceDefaultRed underline text-body-regular">
            Sair
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
