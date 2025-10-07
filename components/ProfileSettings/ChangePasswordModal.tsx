import { useState, useEffect } from "react";
import { View } from "react-native";
import StandardModal from "../General/StandardModal";
import PasswordField from "../General/Forms/PasswordField";
import FormButton from "../General/Forms/FormButton";
import ToastNotification from "../General/ToastNotification";
import { updateUserPassword } from "../../api/user-api";
import { getUserInfo, getJWT } from "../../services/storage-service";
import FormFieldAlert from "../General/Forms/FormFieldAlert";
import {
  validatePasswordContainsLetter,
  validatePasswordLength,
} from "../General/validation";
import { alertErrorCode } from "../../services/error-alert-service";

const ChangePasswordModal = () => {
  // States
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isFormFilledOut, setIsFormFilledOut] = useState(false);
  const [passwordAlert, setPasswordAlert] = useState("");

  // useEffects
  useEffect(() => {
    if (newPassword.length == 0) return setPasswordAlert("");
    if (!validatePasswordContainsLetter(newPassword)) {
      // The password doesn't contain a letter TODO: Get confirmation from Luiza
      return setPasswordAlert("Senha deve conter pelo menos 1 letra");
    }
    if (!validatePasswordLength(newPassword)) {
      // The password is too short TODO: Get confirmation from Luiza
      return setPasswordAlert("Senha muito curta");
    }
    if (newPassword !== confirmPassword) {
      // The passwords don't match TODO: Get confirmation from Luiza
      return setPasswordAlert("As senhas não coincidem!");
    }

    return setPasswordAlert("");
  }, [newPassword, confirmPassword]);

  useEffect(() => {
    setIsFormFilledOut(checkIsFormFilledOut());
  }, [currentPassword, newPassword, confirmPassword, passwordAlert]);

  // Gauge whether the form is filled out
  const checkIsFormFilledOut = () => {
    if (currentPassword.length == 0) return false;
    if (newPassword.length == 0) return false;
    if (confirmPassword.length == 0) return false;
    if (passwordAlert != "") return false;
    return true;
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  // Submit password change
  const submitForm = async () => {
    try {
      // Get user ID
      const userInfo = await getUserInfo();
      const JWT = await getJWT();
      // Make request
      await updateUserPassword(userInfo.id, currentPassword, newPassword, JWT);
      // Show success message
      ToastNotification("success", "Senha alterada!");
      // Clear fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // This delay is a bodge, but it's the easiest way to show a toast message and close the modal at the same time rn...
      // Too bad!
      // Close modal
      setTimeout(() => closeModal(), 1000);
    } catch (error) {
      // Handle errors
      console.log("Error updating password:", error?.data?.error ?? error);
      alertErrorCode(error?.data?.error?.code);
    }
  };

  return (
    <>
      {/* Button for opening modal */}
      <FormButton type="warning" onPress={() => setModalVisible(true)}>
        Alterar senha
      </FormButton>

      {/* Modal */}
      <StandardModal
        modalVisible={modalVisible}
        closeModal={closeModal}
        id="EducadoModal"
        title="Alterar senha"
      >
        {/* I wish they'd properly support gap in nativewind... */}
        <View className="mx-4 flex flex-col">
          <PasswordField
            label="Senha atual"
            password={currentPassword}
            setPassword={setCurrentPassword}
            className="mb-4"
          />
          <PasswordField
            label="Nova senha"
            password={newPassword}
            setPassword={setNewPassword}
            className="mb-4"
          />
          <PasswordField
            label="Confirmar senha"
            password={confirmPassword}
            setPassword={setConfirmPassword}
          />
          <FormFieldAlert label={passwordAlert} />
          <FormButton
            onPress={submitForm}
            disabled={!isFormFilledOut}
            className="mt-4"
          >
            Confirmar
          </FormButton>
        </View>
      </StandardModal>
    </>
  );
};

export default ChangePasswordModal;
