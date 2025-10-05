import { useState } from "react";

// Components
import { View } from "react-native";
import FormTextField from "./FormTextField";
import PasswordEye from "./PasswordEye";
import PropTypes from "prop-types";

const PasswordField = (props) => {
  PasswordField.propTypes = {
    password: PropTypes.string,
    setPassword: PropTypes.func,
    style: PropTypes.array,
    placeholder: PropTypes.string,
    label: PropTypes.string,
    required: PropTypes.bool,
    error: PropTypes.bool,
  };

  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <View className="relative" style={props.style}>
        <FormTextField
          testId="passwordInput"
          placeholder={props.placeholder ?? "Insira sua senha"} // Type your password
          value={props.password}
          onChangeText={(inputPassword) => props.setPassword(inputPassword)}
          label={props.label ?? "Senha"} // Password
          required={props.required ?? true} // Default to true
          secureTextEntry={!showPassword}
          error={props.error ?? false} // Shows red border if true
        />
        <PasswordEye
          showPasswordIcon={showPassword}
          toggleShowPassword={toggleShowPassword}
        />
      </View>
    </>
  );
};

export default PasswordField;
