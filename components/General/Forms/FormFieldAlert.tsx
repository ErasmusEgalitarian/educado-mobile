import { View, Text } from "react-native";

/**
 * Component for showing an alert below a form field
 * @param {Object} props should contain the following properties:
 * - label: String
 * - success: Boolean
 */
const FormFieldAlert = (props: { label: string; success: boolean }) => {
  return (
    <View className="flex-row items-center">
      {props.success? (
        <Text className="text-h4-sm-regular text-surfaceDefaultGreen">{props.label}</Text>
      ) : (
        <Text className="text-h4-sm-regular text-textLabelRed">{props.label}</Text>
      )}
    </View>
  );
};

export default FormFieldAlert;
