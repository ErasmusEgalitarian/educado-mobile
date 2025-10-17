import { View } from "react-native";
import { Text } from "react-native";

export interface ProfileNameCircleProps {
  firstName: string;
  lastName: string;
  className?: string;
  textClassName?: string;
}

/**
 * Component for showing an alert below a form field.
 *
 * @param firstName
 * @param lastName
 * @param className
 * @param textClassName
 */
export const ProfileNameCircle = ({
  firstName,
  lastName,
  className,
  textClassName,
}: ProfileNameCircleProps) => {
  return (
    <View
      className={`aspect-square h-24 w-24 items-center justify-center rounded-full ${className ?? ""}`}
    >
      <Text
        className={`mt-2 text-center text-5xl font-bold text-projectWhite ${textClassName ?? ""}`}
      >
        {firstName.charAt(0).toUpperCase()}
        {lastName.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
};

// For legacy purposes
export default ProfileNameCircle;
