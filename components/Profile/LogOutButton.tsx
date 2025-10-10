import { View, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Text from "../General/Text";
import tailwindConfig from "../../tailwind.config.js";
import PropTypes from "prop-types";

const LOGIN_TOKEN = "@loginToken";
const USER_INFO = "@userInfo";
const tailwindColors = tailwindConfig.theme.colors;
const STUDENT_INFO = "@studentInfo";

export default function LogOutButton(props) {
  LogOutButton.propTypes = {
    testID: PropTypes.string,
  };

  const navigation = useNavigation();

  async function logOut() {
    try {
      await AsyncStorage.removeItem(LOGIN_TOKEN);
      await AsyncStorage.removeItem(USER_INFO);
      await AsyncStorage.removeItem(STUDENT_INFO);

      navigation.navigate("LoginStack");
    } catch (e) {
      console.log(e);
    }
  }

  const logoutAlert = () =>
    Alert.alert("Sair", "Tem certeza que deseja sair?", [
      {
        text: "Não",
        onPress: () => console.log("No Pressed"),
        style: "cancel",
      },
      { text: "Sim", onPress: logOut },
    ]);

  return (
    <View className="flex items-center py-[6%]">
      <TouchableOpacity onPress={logoutAlert}>
        <View className="flex flex-row items-center">
          <MaterialCommunityIcons
            name="logout"
            size={30}
            color={tailwindColors.error}
            testID={props.testID}
          />
          <Text className="font-sans-bold text-center text-lg text-error underline">
            Sair
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
