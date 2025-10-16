import { View } from "react-native";
import Text from "@/components/General/Text";

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
        <Text className="mx-2 text-base text-success">{props.label}</Text>
      ) : (
        <Text className="mx-2 text-base text-error">{props.label}</Text>
      )}
    </View>
  );
};

export default FormFieldAlert;
