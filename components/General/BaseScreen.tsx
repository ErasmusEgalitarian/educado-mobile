import { View } from "react-native";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { ReactNode } from "react";

interface BaseScreenProps {
  children: ReactNode;
  className?: string;
}

export const BaseScreen = ({ children, className }: BaseScreenProps) => {
  const mergedClasses = ["flex-1 bg-secondary", className].join(" ");

  return (
    <AlertNotificationRoot>
      <View className={mergedClasses}>{children}</View>
    </AlertNotificationRoot>
  );
};
