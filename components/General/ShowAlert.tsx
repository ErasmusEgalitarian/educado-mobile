import { Alert } from "react-native";

/**
 * Function for showing an alert as a popup with a message
 * @param {String} error the error message to be shown
 */
export default function ShowAlert(error) {
  Alert.alert(
    error,
    "Tente novamente", // Try again
    [
      {
        text: "Certo", // OK
        style: "cancel",
      },
    ],
    {
      cancelable: true,
    },
  );
}
