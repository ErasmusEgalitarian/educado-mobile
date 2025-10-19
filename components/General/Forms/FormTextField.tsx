import { View, TextInput, KeyboardTypeOptions, Text } from "react-native";

interface PropTypes {
  autoComplete?:
    | "off"
    | "username"
    | "password"
    | "email"
    | "name"
    | "tel"
    | "street-address"
    | "postal-code"
    | "cc-number"
    | "cc-exp"
    | "cc-csc"
    | "cc-exp-month"
    | "cc-exp-year"
    | "additional-name"
    | "address-line1"
    | "address-line2"
    | "birthdate-day"
    | "birthdate-full"
    | "birthdate-month"
    | "birthdate-year"
    | "country"
    | "current-password"
    | "family-name"
    | "given-name"
    | "honorific-prefix"
    | "honorific-suffix"
    | "new-password"
    | "one-time-code"
    | "organization"
    | "postal-code"
    | "street-address"
    | "url"
    | undefined;
  bordered?: boolean;
  error?: boolean;
  keyboardType?: KeyboardTypeOptions | undefined;
  label?: string;
  onChangeText?: (text: string) => void;
  passwordGuidelines?: boolean;
  placeholder?: string;
  required?: boolean;
  secureTextEntry?: boolean;
  value?: string;
}

const FormTextField = (props: PropTypes) => {
  return (
    <View>
      <View className="flex flex-row">
        {/* Text size above input fields on login and registration */}
        <Text className={"ml-2 text-lg"}>{props.label ?? ""}</Text>

        {/* Text size for red asterisks (fields required) */}
        <Text className={"ml-1 text-lg text-error"}>
          {props.required ? "*" : ""}
        </Text>
      </View>
      <View className="">
        {/* Various properties for text input fields */}
        <TextInput
          className={`w-full rounded-lg bg-projectWhite py-4 pl-[10px] text-base ${
            props.bordered && !props.error ? "border border-projectGray" : ""
          } ${props.error ? "border border-error bg-errorTheSecond" : ""}`}
          placeholder={props.placeholder ?? ""} // Placeholder text to be displayed
          keyboardType={props.keyboardType} // Keyboard type (e.g. numeric, email-address, etc.)
          autoComplete={props.autoComplete} // Whether to enable auto-completion
          secureTextEntry={props.secureTextEntry ?? false} // Whether to mask the input (for passwords, etc.)
          onChangeText={(value) => props.onChangeText?.(value)} // Callback function to be called when the text changes
          value={props.value} // Value of the input
        />
      </View>
    </View>
  );
};

export default FormTextField;
