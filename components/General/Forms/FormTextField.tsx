import { View, TextInput, Text, TextInputProps } from "react-native";
import { PasswordEye } from "@/components/General/Forms/PasswordEye";
import { useState } from "react";

interface FormTextFieldProp extends TextInputProps {
  bordered?: boolean;
  error?: boolean;
  label?: string;
  required?: boolean;
  showPasswordEye?: boolean;
}

export const FormTextField = ({
  autoComplete,
  bordered,
  error,
  keyboardType,
  label,
  onChangeText,
  placeholder,
  value,
  required,
  showPasswordEye,
}: FormTextFieldProp) => {
  const [showPassword, setShowPassword] = useState(showPasswordEye ?? false);

  return (
    <View>
      <View className="relative flex flex-row flex-wrap">
        <Text className="ml-2 text-body-regular">{label ?? ""}</Text>
        <Text className="ml-1 text-surfaceDefaultRed text-body-regular">
          {required ? "*" : ""}
        </Text>
        {(showPasswordEye ?? false) ? (
          <View className={"absolute right-[15] top-11 z-10 ml-auto"}>
            <PasswordEye
              showPasswordIcon={showPassword}
              toggleShowPassword={() => {
                setShowPassword(!showPassword);
              }}
            />
          </View>
        ) : null}
        <TextInput
          className={`w-full rounded-lg bg-surfaceSubtleGrayscale py-4 pl-[10px] text-subtitle-regular ${
            bordered && !error ? "border border-projectGray" : ""
          } ${error ? "border border-b-borderDefaultRed bg-surfaceSubtleRed" : ""}`}
          placeholder={placeholder ?? ""}
          keyboardType={keyboardType}
          autoComplete={autoComplete}
          secureTextEntry={showPassword}
          onChangeText={(value) => onChangeText?.(value)}
          value={value}
        />
      </View>
    </View>
  );
};

export default FormTextField;
