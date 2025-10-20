import { View, Text, TouchableOpacity } from "react-native";

interface PropTypes {
  children: string;
  disabled?: boolean;
  onPress?: () => void;
  style?: object[];
}

const FormButton = (props: PropTypes) => {

  return (
    <>
      <View>
        <TouchableOpacity
          className={
            "rounded-xl px-4 py-3 " +
            (props.disabled ? "bg-surfaceDisabledGrayscale" : "bg-surfaceDefaultCyan")
          }
          style={props.style ?? null}
          onPress={props.onPress}
          disabled={props.disabled}
        >
          <Text
            className={"text-body-bold text-center " +
              (props.disabled ? "text-greyscaleTexticonDisabled" : "text-textNegativeGrayscale")
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
