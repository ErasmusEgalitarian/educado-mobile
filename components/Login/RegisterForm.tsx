import { useEffect, useState } from "react";
import { View } from "react-native";
import { loginUser, registerUser } from "@/api/user-api";
import FormTextField from "@/components/General/Forms/FormTextField";
import FormButton from "@/components/General/Forms/FormButton";
import PasswordEye from "@/components/General/Forms/PasswordEye";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ShowAlert from "@/components/General/ShowAlert";
import FormFieldAlert from "@/components/General/Forms/FormFieldAlert";
import {
  removeEmojis,
  validatePasswordContainsLetter,
  validatePasswordLength,
  validateEmail,
  validateName,
} from "@/components/General/validation";
import Text from "@/components/General/Text";
import errorSwitch from "@/components/General/error-switch";
import { useNavigation } from "@react-navigation/native";
import DialogNotification from "@/components/General/DialogNotification";
import { AlertNotificationRoot } from "react-native-alert-notification";
import colors from "@/theme/colors";
import { setUserInfo, setJWT } from "@/services/storage-service";

/**
 * Component for registering a new account in the system, used in the register screen
 */
const RegisterForm = () => {
  const tailwindColors = colors;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation<any>();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [emailAlert, setEmailAlert] = useState<string>("");
  const [nameAlert, setNameAlert] = useState("");
  const [isAllInputValid, setIsAllInputValid] = useState<boolean>(false);
  const [confirmPasswordAlert, setConfirmPasswordAlert] = useState<string>("");

  // State variable to track password visibility
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // Password Constraint variables
  const [passwordContainsLetter, setPasswordContainsLetter] = useState<boolean>(false);
  const [passwordLengthValid, setPasswordLengthValid] = useState<boolean>(false);

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

  useEffect(() => {
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
    const validationPassed =
      nameAlert === "" &&
      emailAlert === "" &&
      name !== "" &&
      email !== "" &&
      passwordLengthValid &&
      passwordContainsLetter &&
      confirmPasswordAlert === "";

    setIsAllInputValid(validationPassed);
  }, [nameAlert, emailAlert, passwordLengthValid, passwordContainsLetter, confirmPasswordAlert, name, email]);

  // Functions to toggle password visibility states
  const toggleShowPassword = (): void => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = (): void => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const checkIfPasswordsMatch = (password: string, confirmPassword: string): void => {
    if (password === confirmPassword) {
      setConfirmPasswordAlert("");
    } else {
      setConfirmPasswordAlert("Os campos de senha precisam ser iguais");
    }
  };

  /**
   * Function for registering a new user in the database
   */
  const register = async (name: string, email: string, password: string) => {
    if (!isAllInputValid) {
      return;
    }

    const obj = {
      firstName: name.trim(),
      // TODO: once backend is setup and api call are handled properly, the last name shoult be removed
      lastName: "NO LAST NAME SHOULD BE HERE!",
      email: email.toLowerCase(),
      password: password,
    };

    try {

      await registerUser(obj)
        .then(async (response) => {
          // Save user info in storage
          // TODO: Refactor backend to get the same response as on login
          const userInfo = {
            id: response.baseUser._id,
            ...response.baseUser,
          };
          await setUserInfo(userInfo);
        })
        .then(async () => {
          // logs in the user, if no errors occur, navigates to home screen and sets token
          await loginFromRegister(obj);
        })
        .catch((error) => {
          ShowAlert(errorSwitch(error));
        });
    } catch (e) {
      console.log(e);
    }
  };

  /**
   * function to log in the user and set the login token, meant to be called after registering
   * @param {Object} obj the object containing the following fields:
   *  email: String
   *  password: String
   */
  const loginFromRegister = async (obj: {email: string, password: string}) => {
    try {
      await loginUser(obj)
        .then((response) => {
          setJWT(response.accessToken);
          DialogNotification("success", "Usuário cadastrado! Cantando em...");
          setTimeout(() => {
            navigation.navigate("HomeStack");
          }, 2500);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View className="mb-2 flex h-[78vh] flex-col">
      <AlertNotificationRoot>
        <View className="mb-2 flex-none">
          <FormTextField
            label="Nome" // name
            value={name}
            testId="firstNameInput"
            placeholder="Nome Sobrenome"
            required={true}
            onChangeText={(firstName) => {
              setName(firstName);
            }}
            error={nameAlert !== ""}
          />
        </View>
        <View className="mb-2 flex-none">
          <FormTextField
            label="Email"
            testId="emailInput"
            value={email}
            placeholder="useremail@gmail.com"
            keyboardType="email-address"
            required={true}
            onChangeText={async (email) => {
              setEmail(email);
              validateEmail(email);
            }}
            error={emailAlert !== ""}
          />
          {/*Only render if there is error, otherwise there will be an empty area for nothing.*/}
          {emailAlert ? (
            <FormFieldAlert label={emailAlert} testId="emailAlert" />
          ) : (
            <></>
          )}
        </View>
        <View className="flex-none">
          <View>
            <FormTextField
              label="Senha" //Password
              testId="passwordInput"
              value={password}
              placeholder="********"
              placeholderTextColor={tailwindColors.projectGray}
              secureTextEntry={!showPassword}
              required={true}
              onChangeText={(inputPassword: string) => {
                setPassword(removeEmojis(inputPassword));
              }}
              error={password !== "" && !(passwordContainsLetter && passwordLengthValid)}
            />
            <PasswordEye
              testId="passwordEye"
              showPasswordIcon={!showPassword}
              toggleShowPassword={toggleShowPassword}
            />
          </View>

          <View className="mt-1 h-6 flex-row justify-start">
            <Text
              testId="passwordLengthAlert"
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
                  color={tailwindColors.success}
                />
              ) : null}
            </View>
          </View>
          <View className="h-6 flex-row justify-start">
            <Text
              testId="passwordLetterAlert"
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
                  color={tailwindColors.success}
                />
              ) : null}
            </View>
          </View>
        </View>
        <View className="flex-none">
          <View className="relative">
            <FormTextField
              label="Confirmar senha" // Confirm password
              value={confirmPassword}
              testId="confirmPasswordInput"
              onChangeText={(inputConfirmPassword: string) => {
                setConfirmPassword(removeEmojis(inputConfirmPassword));
              }}
              placeholder="********" // Confirm your password
              secureTextEntry={!showConfirmPassword}
              required={true}
              error={confirmPasswordAlert !== ""}
            />
            <PasswordEye
              testId="confirmPasswordEye"
              showPasswordIcon={!showConfirmPassword}
              toggleShowPassword={toggleShowConfirmPassword}
            />
          </View>
          <FormFieldAlert label={confirmPasswordAlert} testId="confirmPasswordAlert" />
        </View>
        {/* Register */}
        <View className="bg-primary mt-auto flex-none">
          <FormButton
            onPress={() => register(name, email, password)}
            testId="registerButton"
            disabled={!isAllInputValid}
          >
            Cadastrar
          </FormButton>
        </View>
      </AlertNotificationRoot>
    </View>
  );
}

export default RegisterForm;
