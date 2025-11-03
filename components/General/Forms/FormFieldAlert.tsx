import { View, Text } from "react-native";

interface FormFieldAlertProps {
  label: string;
  success?: boolean;
}

/**
 * Component for showing an alert below a form field.
 *
 * @param label - The label.
 * @param success - Whether the alert is a success or error.
 */
export const FormFieldAlert = ({ label, success }: FormFieldAlertProps) => {
  return (
    <View className="flex-row items-center">
      {success ? (
        <Text className="text-surfaceDefaultGreen text-footnote-regular-caps">
          {label}
        </Text>
      ) : (
        <Text className="text-textLabelRed text-footnote-regular-caps">
          {label}
        </Text>
      )}
    </View>
  );
};

export default FormFieldAlert;
