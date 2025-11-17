import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { loginUser, registerUser } from "@/api/user-api";
import { FormTextField } from "@/components/General/Forms/FormTextField";
import { FormButton } from "@/components/General/Forms/FormButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ShowAlert from "@/components/General/ShowAlert";
import { FormFieldAlert } from "@/components/General/Forms/FormFieldAlert";
import {
  removeEmojis,
  validatePasswordContainsLetter,
  validatePasswordLength,
  validateEmail,
  validateName,
} from "@/components/General/validation";
import errorSwitch from "@/components/General/error-switch";
import { useNavigation } from "@react-navigation/native";
import DialogNotification from "@/components/General/DialogNotification";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { colors } from "@/theme/colors";
import { setUserInfo, setJWT } from "@/services/storage-service";
import { UserInfo } from "@/types/user";
import { isAxiosError } from "axios";
import { useLoginStrapi, useSignUpStrapi } from "@/hooks/query";

interface BaseUserType {
  _id: string;
  user: UserInfo;
}

/**
 * Component for registering a new account in the system, used in the register screen
 */
export const RegisterForm = () => {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailAlert, setEmailAlert] = useState("");
  const [nameAlert, setNameAlert] = useState("");
  const [isAllInputValid, setIsAllInputValid] = useState(false);
  const [confirmPasswordAlert, setConfirmPasswordAlert] = useState("");

  // Password Constraint variables
  const [passwordContainsLetter, setPasswordContainsLetter] = useState(false);
  const [passwordLengthValid, setPasswordLengthValid] = useState(false);

  useEffect(() => {
    // Clear input and alerts on first render
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");

    setNameAlert("");
    setEmailAlert("");
    setIsAllInputValid(false);
    setConfirmPasswordAlert("");
  }, []);

  useEffect(() => {
    const containsLetter = validatePasswordContainsLetter(password);
    setPasswordContainsLetter(containsLetter);
    const lengthValid = validatePasswordLength(password);
    setPasswordLengthValid(lengthValid);
    checkIfPasswordsMatch(password, confirmPassword);
  }, [confirmPassword, password]);

  // validating name
  useEffect(() => {
    if (name !== "") {
      setNameAlert(validateName(name));
    }
  }, [name]);

  // validate email
  useEffect(() => {
    if (email === "") {
      setEmailAlert("");
      return;
    }

    setEmailAlert(validateEmail(email));
  }, [email]);

  /**
   * useEffect runs with every new input and checks for validation.
   */
  useEffect(() => {
    const validationPassed: boolean =
      name.trim() !== "" && // Name has a value
      email.trim() !== "" && // Email has a value
      nameAlert === "" && // Name has no errors
      emailAlert === "" && // Email has no errors
      passwordLengthValid && // Password is long enough
      passwordContainsLetter && // Password contains a letter
      confirmPasswordAlert === ""; // Passwords match

    setIsAllInputValid(validationPassed);
  }, [
    nameAlert,
    emailAlert,
    passwordLengthValid,
    passwordContainsLetter,
    confirmPasswordAlert,
    name,
    email,
  ]);

  const checkIfPasswordsMatch = (
    password: string,
    confirmPassword: string,
  ): void => {
    if (password === confirmPassword) {
      setConfirmPasswordAlert("");
    } else {
      setConfirmPasswordAlert("Os campos de senha precisam ser iguais");
    }
  };

  const signUpMutation = useSignUpStrapi();
  const loginStudentMutation = useLoginStrapi();

  /**
   * Function for registering a new user in the database
   */
  const register = async (
    name: string,
    email: string,
    password: string,
  ): Promise<void> => {
    if (!isAllInputValid) {
      return;
    }

    const obj = {
      firstName: name.trim(),
      // TODO: once backend is setup and api call are handled properly, the last name should be removed
      lastName: "TODOFIX",
      email: email.toLowerCase(),
      password: password,
    };

    try {
      // TODO: the function registerUser needs to be typed for this to work.
      // I am also unsure of its returned type, hence the weird type it now has.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { baseUser }: { baseUser: BaseUserType } = await registerUser(obj);

      const response = await signUpMutation.mutateAsync({
        name,
        email,
        password,
      });

      // TODO: Removie this console.log when migrating to use strapi fully.
      console.log(
        response.accessToken
          ? "Student signed up in strapi"
          : "Failed to sign up student in strapi",
      );

      const userInfo: UserInfo = {
        id: baseUser._id,
        firstName: baseUser.user.firstName,
        lastName: baseUser.user.lastName,
        email: baseUser.user.email,
      };

      await setUserInfo(userInfo);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        throw error.response?.data;
      }

      ShowAlert(errorSwitch(error));
    } finally {
      await loginFromRegister(obj);
    }
  };

  const loginFromRegister = async (obj: {
    email: string;
    password: string;
  }) => {
    try {
      await loginStudentMutation.mutateAsync(obj);
      await loginUser(obj)
        .then(async (response: { accessToken: string }) => {
          await setJWT(response.accessToken);
          DialogNotification("success", "Usuário cadastrado! Cantando em...");
          setTimeout(() => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            navigation.navigate("HomeStack");
          }, 2500);
        })
        .catch((error: unknown) => {
          console.log(error);
        });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View className="mb-2 mt-8 flex h-[70vh] flex-col">
      <AlertNotificationRoot>
        <View className="mb-6 flex-none">
          <FormTextField
            label="Nome" // name
            value={name}
            placeholder="Nome Sobrenome"
            required={true}
            bordered={true}
            onChangeText={(firstName) => {
              setName(firstName);
            }}
            error={nameAlert !== ""}
          />
        </View>
        <View className="mb-6 flex-none">
          <FormTextField
            label="Email"
            value={email}
            placeholder="useremail@gmail.com"
            keyboardType="email-address"
            required={true}
            bordered={true}
            onChangeText={(email: string): void => {
              setEmail(email);
              validateEmail(email);
            }}
            error={emailAlert !== ""}
          />
          {/*Only render if there is error, otherwise there will be an empty area for nothing.*/}
          {emailAlert ? (
            <FormFieldAlert label={emailAlert} success={emailAlert === ""} />
          ) : (
            <></>
          )}
        </View>
        <View className="flex-none">
          <View>
            <FormTextField
              label="Senha" //Password
              value={password}
              placeholder="********"
              required={true}
              bordered={true}
              onChangeText={(inputPassword: string) => {
                setPassword(removeEmojis(inputPassword));
              }}
              error={
                password !== "" &&
                !(passwordContainsLetter && passwordLengthValid)
              }
              showPasswordEye={true}
            />
          </View>

          <View className="mt-1 h-6 flex-row justify-start">
            <Text
              className={
                "text-sm" +
                (password === ""
                  ? " text-projectGray"
                  : passwordLengthValid
                    ? " text-success"
                    : " text-error")
              }
            >
              {/* Minimum 8 characters */}Mínimo 8 caracteres
            </Text>
            <View className="-translate-y-1 flex-row items-center">
              {passwordLengthValid ? (
                <MaterialCommunityIcons
                  name="check"
                  size={20}
                  color={colors.surfaceDefaultGreen}
                />
              ) : null}
            </View>
          </View>
          <View className="mb-6 h-6 flex-row justify-start">
            <Text
              className={
                "text-sm" +
                (password === ""
                  ? " text-projectGray"
                  : passwordContainsLetter
                    ? " text-success"
                    : " text-error")
              }
            >
              {/* Must contain at least one letter */}Conter pelo menos uma
              letra
            </Text>
            <View className="-translate-y-1 flex-row items-center">
              {passwordContainsLetter ? (
                <MaterialCommunityIcons
                  name="check"
                  size={20}
                  color={colors.surfaceDefaultGreen}
                />
              ) : null}
            </View>
          </View>
        </View>
        <View className="mb-2 flex-none">
          <View className="relative">
            <FormTextField
              label="Confirmar senha" // Confirm password
              value={confirmPassword}
              onChangeText={(inputConfirmPassword: string) => {
                setConfirmPassword(removeEmojis(inputConfirmPassword));
              }}
              placeholder="********" // Confirm your password
              required={true}
              bordered={true}
              error={confirmPasswordAlert !== ""}
              showPasswordEye={true}
            />
          </View>
          <FormFieldAlert
            label={confirmPasswordAlert}
            success={confirmPasswordAlert === ""}
          />
        </View>
        {/* Register */}
        <View className="mt-auto flex-none">
          <FormButton
            onPress={() => {
              register(name, email, password).catch((error: unknown) => {
                if (isAxiosError(error)) {
                  throw error.response?.data;
                }
                ShowAlert(errorSwitch(error));
              });
            }}
            disabled={!isAllInputValid}
          >
            Entrar
          </FormButton>
        </View>
      </AlertNotificationRoot>
    </View>
  );
};
