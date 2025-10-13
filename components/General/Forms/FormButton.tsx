import { TouchableOpacity } from "react-native";
import { View } from "react-native";
import Text from "@/components/General/Text";

interface PropTypes {
  children: string;
  disabled?: boolean;
  onPress?: () => void;
  style?: object[];
  type?: "primary_custom" | "error" | "warning";
}

const FormButton = (props: PropTypes) => {
  // Put this here for possible custom styling
  const typeStyles = {
    primary_custom: "bg-primaryCustom",
    error: "bg-error",
    warning: "bg-yellow",
  };

  return (
    <>
      <View>
        <TouchableOpacity
          className={
            "rounded-xl px-4 py-3 " +
            (typeStyles[props.type ?? "primary_custom"] ??
              typeStyles.primary_custom) +
            (props.disabled ? "text-[#809CAD]! bg-[#C1CFD7]" : "")
          }
          style={props.style ?? null}
          onPress={props.onPress}
          disabled={props.disabled}
        >
          <Text
            className={
              "text-center font-sans-bold text-body " +
              (props.disabled ? "text-[#809CAD]" : "text-projectWhite")
            }
          >
            {props.children}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default FormButton;
