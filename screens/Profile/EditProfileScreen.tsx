import { useEffect, useState, useCallback } from "react";
import {
  View,
  SafeAreaView,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import Text from "../../components/General/Text";
import ProfileNameCircle from "../../components/Profile/ProfileNameCircle";
import FormButton from "../../components/General/Forms/FormButton";
import ChangePasswordModal from "../../components/ProfileSettings/ChangePasswordModal";
import FormTextField from "../../components/General/Forms/FormTextField";
import {
  deletePhoto,
  deleteUser,
  getStudentInfo,
  updateUserFields,
} from "../../api/user-api";
import BackButton from "../../components/General/BackButton";
import { useNavigation } from "@react-navigation/native";
import {
  validateEmail,
  validateName,
} from "../../components/General/validation";
import FormFieldAlert from "../../components/General/Forms/FormFieldAlert";
import {
  getUserInfo,
  setUserInfo,
  getJWT,
  getStudentProfilePhoto,
  updateStudentInfo,
  getLoginToken,
  getUserId,
} from "../../services/storage-service";
import ShowAlert from "../../components/General/ShowAlert";
import errorSwitch from "../../components/General/error-switch";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

/**
 * Edit profile screen
 * @returns {React.Element} Component for the edit profile screen
 */
export default function EditProfileScreen() {
  const [id, setId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [fetchedFirstName, setFetchedFirstName] = useState("");
  const [fetchedLastName, setFetchedLastName] = useState("");
  const [fetchedEmail, setFetchedEmail] = useState("");
  const [changedFields, setChangedFields] = useState({});
  const [emailAlert, setEmailAlert] = useState("");
  const [firstNameAlert, setFirstNameAlert] = useState("");
  const [lastNameAlert, setLastNameAlert] = useState("");
  const [photo, setPhoto] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    setChangedFields({
      firstName: firstName !== fetchedFirstName ? firstName : undefined,
      lastName: lastName !== fetchedLastName ? lastName : undefined,
      email: email !== fetchedEmail ? email : undefined,
    });
  }, [
    firstName,
    lastName,
    email,
    fetchedFirstName,
    fetchedLastName,
    fetchedEmail,
  ]);

  useEffect(() => {
    let validationError = "";
    validationError = validateName(firstName, "Nome"); // First name
    setFirstNameAlert(validationError);
  }, [firstName]);

  useEffect(() => {
    let validationError = "";
    validationError = validateName(lastName, "Sobrenome"); // Last name
    setLastNameAlert(validationError);
  }, [lastName]);

  useEffect(() => {
    const validationError = validateEmail(email);
    setEmailAlert(validationError);
  }, [email]);

  /**
   * Validates the input fields
   */
  function validateInput() {
    return (
      firstNameAlert === "" &&
      lastNameAlert === "" &&
      emailAlert === "" &&
      (changedFields.firstName !== undefined ||
        changedFields.lastName !== undefined ||
        changedFields.email !== undefined)
    );
  }

  /**
   * Fetches the user profile
   */
  const getProfile = async () => {
    try {
      const fetchedProfile = await getUserInfo();
      if (fetchedProfile !== null) {
        setId(fetchedProfile.id);
        setFetchedFirstName(fetchedProfile.firstName);
        setFetchedLastName(fetchedProfile.lastName);
        setFetchedEmail(fetchedProfile.email);
        setFirstName(fetchedProfile.firstName);
        setLastName(fetchedProfile.lastName);
        setEmail(fetchedProfile.email);
        const photo = await getStudentProfilePhoto();
        setPhoto(photo);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const runAsyncFunction = async () => {
        try {
          await getProfile();
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      };

      runAsyncFunction();
    }, []),
  );

  /**
   * persists the changed user info
   */
  const saveUserInfo = async () => {
    if (!validateInput()) {
      return;
    }

    const fetchedProfile = {
      id: id,
      firstName: fetchedFirstName,
      lastName: fetchedLastName,
      email: fetchedEmail,
    };

    const updatedProfile = {
      ...fetchedProfile,
      ...(changedFields.firstName !== undefined
        ? { firstName: changedFields.firstName }
        : {}),
      ...(changedFields.lastName !== undefined
        ? { lastName: changedFields.lastName }
        : {}),
      ...(changedFields.email !== undefined
        ? { email: changedFields.email }
        : {}),
    };

    try {
      const LOGIN_TOKEN = await getJWT();
      await updateUserFields(id, changedFields, LOGIN_TOKEN);
      await setUserInfo(updatedProfile);
      getProfile();
    } catch (error) {
      ShowAlert(errorSwitch(error));
    }
  };

  const deleteAccountAlert = () =>
    Alert.alert(
      "Deletar conta",
      "Tem certeza de que deseja excluir sua conta?",
      [
        {
          text: "Não",
          style: "cancel",
        },
        { text: "Sim", onPress: deleteAccount },
      ],
    );

  const deleteAccount = async () => {
    try {
      const LOGIN_TOKEN = await getJWT();
      const USER_INFO = "@userInfo";
      await AsyncStorage.multiRemove([LOGIN_TOKEN, USER_INFO]);
      await deleteUser(id, LOGIN_TOKEN);
      navigation.navigate("LoginStack");
    } catch (error) {
      ShowAlert(errorSwitch(error));
    }
  };

  const removeImage = async () => {
    setPhoto("");
    var profile = getStudentInfo();
    updateStudentInfo({ ...profile, photo: "" });
    const userId = await getUserId();
    await deletePhoto(userId, await getLoginToken());
  };

  return (
    <SafeAreaView className="bg-secondary">
      <View className="h-full">
        <View>
          <View className="relative mx-4 mt-12 mb-6">
            {/* Back button */}
            <BackButton onPress={() => navigation.navigate("ProfileHome")} />

            {/* Title */}
            <Text className="w-full text-center font-sans-bold text-xl">
              Editar perfil
            </Text>
          </View>

          <View className="flex w-screen flex-row justify-evenly px-6">
            {/* Profile image */}
            {photo ? (
              <Image
                source={{ uri: photo }}
                className="h-24 w-24 rounded-full"
              />
            ) : (
              <ProfileNameCircle
                firstName={fetchedFirstName}
                lastName={fetchedLastName}
              />
            )}
            {/* Edit image */}
            <View className="flex flex-col items-center justify-evenly">
              <FormButton
                className="py-2"
                onPress={() => navigation.navigate("Camera")}
              >
                Trocar imagem
              </FormButton>
              <TouchableOpacity onPress={removeImage}>
                <Text className="text-primary_custom underline">
                  Remover imagem
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="flex w-screen flex-col px-8 pt-8">
          <View className="mb-8">
            <FormTextField
              label="Nome"
              required={true}
              placeholder="Insira sua nome"
              value={firstName}
              onChangeText={(firstName) => {
                setFirstName(firstName);
                validateName(firstName);
              }}
              testId="firstName"
            ></FormTextField>
            <FormFieldAlert label={firstNameAlert} testId="firstNameAlert" />
          </View>
          <View className="mb-8">
            <FormTextField
              label="Sobrenome"
              required={true}
              placeholder="Insira sua sobrenome"
              value={lastName}
              onChangeText={(lastName) => {
                setLastName(lastName);
                validateName(lastName);
              }}
              testId="lastName"
            ></FormTextField>
            <FormFieldAlert label={lastNameAlert} testId="lastNameAlert" />
          </View>
          <View className="mb-12">
            <FormTextField
              label="E-mail"
              required={true}
              placeholder="Insira sua e-mail"
              value={email}
              keyboardType="email-address"
              onChangeText={async (email) => {
                setEmail(email);
                validateEmail(email);
              }}
              testId="email"
            ></FormTextField>
            <FormFieldAlert label={emailAlert} testId="emailAlert" />
          </View>

          {/* Change password */}
          <ChangePasswordModal />

          <View className="flex flex-row items-center justify-between pt-12">
            <Text
              className="text-sm text-primary_custom underline"
              onPress={() => deleteAccountAlert()}
            >
              Excluir minha conta
            </Text>
            <FormButton
              onPress={() => saveUserInfo()}
              disabled={!validateInput()}
            >
              Salvar
            </FormButton>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
