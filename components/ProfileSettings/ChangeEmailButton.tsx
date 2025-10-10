import { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateUserFields } from "../../api/user-api";
import patterns from "../../assets/validation/patterns";
import Text from "../General/Text";

let LOGIN_TOKEN;
const USER_INFO = "@userInfo";

export default function ProfileComponent() {
  const [id, setId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [tempEmail, setTempEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getProfile = async () => {
    try {
      const fetchedProfile = JSON.parse(await AsyncStorage.getItem(USER_INFO));

      if (fetchedProfile !== null) {
        setId(fetchedProfile.id);
        setFirstName(fetchedProfile.firstName);
        setLastName(fetchedProfile.lastName);
        setEmail(fetchedProfile.email);
        LOGIN_TOKEN = await AsyncStorage.getItem("@loginToken");
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const saveEmailChanges = async () => {
    // Regular expression for email validation
    const emailRegex = patterns.email;

    if (newEmail !== email && newEmail === tempEmail) {
      if (emailRegex.test(newEmail)) {
        // Call the updateUserFields function to update the email on the server
        try {
          setIsLoading(true); // Set loading state to true

          await updateUserFields(id, { email: newEmail }, LOGIN_TOKEN);

          // Update the state with the new username and close modal
          setEmail(newEmail);

          // Save changes to AsyncStorage or your API
          const updatedProfile = {
            id,
            firstName: firstName,
            lastName: lastName,
            email: newEmail,
          };

          await AsyncStorage.setItem(USER_INFO, JSON.stringify(updatedProfile));
          setEmailModalVisible(false);
        } catch (error) {
          // Error updating email, try again:
          Alert.alert(
            "Alerta",
            "Erro ao atualizar o e-mail, tente novamente: ",
            error.message,
          );
        }
      } else {
        // Invalid email format. Please enter a valid email address.
        Alert.alert(
          "Alerta",
          "Formato de e-mail inválido. Digite um endereço de e-mail válido.",
        );
      }
    } else {
      // The emails do not match or are the same as your current email. Try again.
      Alert.alert(
        "Alerta",
        "Os e-mails não correspondem ou são iguais ao seu e-mail atual. Tente novamente.",
      );
    }
    setIsLoading(false);
  };

  const openEmailModal = () => {
    // Reset the email input fields when the modal is opened
    setNewEmail("");
    setTempEmail("");
    setEmailModalVisible(true);
  };

  return (
    <View>
      <Text className="mb-2 text-left text-caption-medium text-projectBlack">
        Email
      </Text>
      <TouchableOpacity
        className="w-full rounded-medium bg-projectWhite px-5 py-4"
        onPress={openEmailModal} // Call the new function to open the modal
      >
        <Text className="text-left text-body text-projectGray">{email}</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={emailModalVisible}
        onRequestClose={() => setEmailModalVisible(false)}
      >
        <View className="flex h-full items-center justify-center bg-projectBlack bg-opacity-50">
          <View className="w-11/12 max-w-md rounded-lg bg-projectLightGray p-4">
            <View className="flex flex-col items-center">
              <TextInput
                value={newEmail}
                onChangeText={setNewEmail}
                placeholder="Digite o novo endereço de e-mail"
                className="mb-4 w-full rounded bg-projectWhite p-4"
              />

              <TextInput
                value={tempEmail}
                onChangeText={setTempEmail}
                placeholder="Confirmar novo endereço de e-mail"
                className="mb-4 w-full rounded bg-projectWhite p-4"
              />

              {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <TouchableOpacity
                  className="w-full rounded-medium bg-primary_custom px-10 py-4"
                  onPress={() => saveEmailChanges()}
                >
                  <Text className="font-sans-bold text-center text-body text-projectWhite">
                    Salvar alterações
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                className="mt-2 w-full rounded-medium border-0 border-opacity-0 px-10 py-4"
                onPress={() => setEmailModalVisible(false)}
              >
                <Text className="font-sans-bold text-center text-projectBlack">
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
