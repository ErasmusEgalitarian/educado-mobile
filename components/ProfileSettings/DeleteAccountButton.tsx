import { TouchableOpacity, Alert, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteUser } from "../../api/user-api";
import { clearAsyncStorage } from "../../services/storage-service";
import Text from "../General/Text";

let LOGIN_TOKEN;
const USER_INFO = "@userInfo";

export default function DeleteAccountButton() {
  const navigation = useNavigation();

  async function Delete() {
    try {
      const obj = JSON.parse(await AsyncStorage.getItem(USER_INFO));
      LOGIN_TOKEN = await AsyncStorage.getItem("@loginToken");

      if (obj !== null) {
        try {
          await deleteUser(obj.id, LOGIN_TOKEN) // skift obj.id til users actual id to test this function
            .then(function (response) {
              console.log(response);
              AsyncStorage.multiRemove([LOGIN_TOKEN, USER_INFO]).then(() => {
                console.log("User account deleted successfully!");
                navigation.navigate("LoginStack");
              });
            })
            .catch((error) => {
              console.log(error);
            });
          await clearAsyncStorage();
        } catch (e) {
          console.log(e);
        }
      } else {
        Alert.alert("Error", "User not found");
      }
    } catch (e) {
      console.log(e);
    }
  }

  const deleteAlert = () =>
    Alert.alert("Deletar conta", "Tem certeza?", [
      {
        text: "Não",
        onPress: () => console.log("No Pressed"),
        style: "cancel",
      },
      { text: "Sim", onPress: Delete },
    ]);

  return (
    <View>
      <Text className="mb-2 text-left text-caption-medium text-projectBlack">
        Deletar conta
      </Text>
      <TouchableOpacity
        className="w-full rounded-medium bg-error px-10 py-4"
        onPress={deleteAlert}
      >
        <Text className="font-sans-bold text-center text-body text-projectWhite">
          Deletar conta
        </Text>
      </TouchableOpacity>
    </View>
  );
}
