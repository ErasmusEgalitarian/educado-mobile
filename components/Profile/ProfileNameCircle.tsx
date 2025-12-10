import { View, Text } from "react-native";

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
      className={`items-center justify-center rounded-[100] bg-surfaceLighterCyan ${className ?? ""}`}
    >
      <Text className={textClassName}>
        {firstName.charAt(0).toUpperCase()}
        {lastName.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
};

// For legacy purposes
export default ProfileNameCircle;
