import { ALERT_TYPE, Toast as RNToast } from "react-native-alert-notification";
import { t } from "@/i18n";

/**
 * Component for showing a toast notification.
 *
 * @param status - The status of the notification.
 * @param message - The message to be displayed in the notification.
 */
export const ToastNotification = (
  status: "success" | "warning" | "error" | (string & {}),
  message: string,
) => {
  if (status === "success") {
    RNToast.show({
      type: ALERT_TYPE.SUCCESS,
      title: `${t("general.success")}!`,
      textBody: message,
    });

    return;
  }

  if (status === "warning") {
    RNToast.show({
      type: ALERT_TYPE.WARNING,
      title: `${t("general.notice")}!`,
      textBody: message,
    });

    return;
  }

  if (status === "error") {
    RNToast.show({
      type: ALERT_TYPE.DANGER,
      title: `${t("general.error")}!`,
      textBody: message,
    });

    return;
  }

  RNToast.show({
    type: ALERT_TYPE.SUCCESS,
    title: `${t("general.notification")}!`,
    textBody: message,
  });
};

export default ToastNotification;
