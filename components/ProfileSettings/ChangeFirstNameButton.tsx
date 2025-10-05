import { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateUserFields } from "../../api/user-api";
import Text from "../General/Text";

let LOGIN_TOKEN;
const USER_INFO = "@userInfo";

export default function ProfileComponent() {
  const [id, setId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [firstNameModalVisible, setFirstNameModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add a loading state

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

  const saveFirstNameChanges = async () => {
    if (newFirstName !== firstName) {
      // Call the updateUserName function to update the username on the server
      try {
        setIsLoading(true); // Set loading state to true

        await updateUserFields(id, { firstName: newFirstName }, LOGIN_TOKEN);

        // Update the state with the new username and close modal
        setFirstName(newFirstName);

        // Save changes to AsyncStorage or your API
        const updatedProfile = {
          id,
          firstName: newFirstName,
          lastName,
          email,
        };

        await AsyncStorage.setItem(USER_INFO, JSON.stringify(updatedProfile));
        setFirstNameModalVisible(false);
      } catch (error) {
        Alert.alert(
          "Alerta",
          "Erro ao atualizar o nome, tente novamente",
          error.message,
        );
      } finally {
        setIsLoading(false); // Set loading state to false after the operation
      }
    } else {
      Alert.alert("Alerta", "Nome não foi alterado");
    }
    setIsLoading(false);
  };

  return (
    <View>
      <Text className="mb-2 text-left text-caption-medium text-projectBlack">
        Nome
      </Text>
      <TouchableOpacity
        className="w-full rounded-medium bg-projectWhite px-5 py-4"
        onPress={() => setFirstNameModalVisible(true)}
      >
        <Text className="text-left text-body text-projectGray">
          {firstName}
        </Text>
      </TouchableOpacity>

      {/* Editable Username Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={firstNameModalVisible}
        onRequestClose={() => setFirstNameModalVisible(false)}
      >
        <View className="flex h-full items-center justify-center bg-projectBlack bg-opacity-50">
          <View className="w-11/12 max-w-md rounded-lg bg-projectLightGray p-4">
            <View className="flex flex-col items-center">
              <TextInput
                value={newFirstName}
                onChangeText={setNewFirstName}
                placeholder="Digite o novo nome"
                className="mb-4 w-full rounded bg-projectWhite p-4"
              />
              {isLoading ? ( // Conditional rendering based on loading state
                <ActivityIndicator size="large" color="#0000ff" /> // Loading spinner
              ) : (
                <TouchableOpacity
                  className="w-full rounded-medium bg-primary_custom px-10 py-4"
                  onPress={() => saveFirstNameChanges()}
                >
                  <Text className="text-center font-sans-bold text-body text-projectWhite">
                    Salvar alterações
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                className="mt-2 w-full rounded-medium border-0 border-opacity-0 px-10 py-4"
                onPress={() => setFirstNameModalVisible(false)}
              >
                <Text className="text-center font-sans-bold text-projectBlack">
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
