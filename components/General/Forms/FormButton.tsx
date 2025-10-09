import { TouchableOpacity } from "react-native";
import { View, Text } from "react-native";

interface FormButtonProps {
  label: string,
  onPress: () => void,
  type: string,
  disabled: boolean,
  style: [],
  children: string
}

/**
 * Button component for eg. login and register screens.
 * @param {Object} props Should contain the following properties:
 * - label: String
 * - onPress: Function
 */
const FormButton = (props: FormButtonProps) => {

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
          className={'px-4 py-3 rounded-xl ' +
            (typeStyles[props.type] ?? typeStyles.primary_custom) +
            (props.disabled ? 'text-[#809CAD]! bg-[#C1CFD7]' : '')}
          style={props.style ?? null}
          onPress={props.onPress}
          disabled={props.disabled}
        >
          {/* eslint-disable-next-line no-restricted-syntax */}
          <Text className={"text-center font-sans-bold text-body " +
            (props.disabled ? "text-[#809CAD]" : "text-projectWhite" )
          }>
            {props.children}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

export default FormButton;
