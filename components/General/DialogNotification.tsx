import { View } from "react-native";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";

/**
 * Component for showing a popup notification
 * @param {string} status status of the notification (success, warning, error, other)
 * @param {string} message message to be displayed in the notification
 */
export default function DialogNotification(status, message) {
  return (
    <View className="z-1000">
      {status === "success"
        ? Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: "Sucesso!",
            textBody: message,
          })
        : status === "warning"
          ? Dialog.show({
              type: ALERT_TYPE.WARNING,
              title: "Aviso!",
              textBody: message,
            })
          : status === "error"
            ? Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: "Erro!",
                textBody: message,
              })
            : Dialog.show({
                type: ALERT_TYPE.INFO,
                title: "Notificação!",
                textBody: message,
              })}
      ,
    </View>
  );
}
