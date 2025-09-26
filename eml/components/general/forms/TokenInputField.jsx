    import React, { useState, useRef } from "react";
    import { View, TextInput, StyleSheet, Keyboard } from "react-native";
    import ShowAlert from "../ShowAlert";

    // TODO: IF TOKEN IS CREATE. ENTER WITHOUT PRESSING BUTTON
    // TODO: ERROR MESSAGE
    // TODO: ADD INPUT MASKING THROUGH REACT NATIVE INPUT MASKING
    // TODO: CREATE JAVA DOCS
    /**
     * The 6 input fields for the mobile verification SMS code
     * @param {*} The  
     * @returns A stringified token to login form
     */

    export default function TokenInputField({ length = 6, onChange, error }) {
    const [values, setValues] = useState(Array(length).fill("")); // ["", "", "", "", "", ""]
    const inputs = useRef([]);

    // Handles backspace logic
    const handleChange = (value, id) => {

        // There can only be 0-1 and A-z so return on anything that is not these values
        if (!/^[0-9a-zA-Z]?$/.test(value)) return;

        const newValues = [...values];
        newValues[id] = value.toUpperCase();
        setValues(newValues);
        onChange?.(newValues.join(""));
        
        if(value === "" && id !== 0){
            inputs.current[id - 1].focus();
        }

        // TODO: ASK PO IF THEY WANT KEYBOARD TO BE DISMISSED AFTER TYPING AND FIX CODE IF NECESSARY
        // if (id === length - 1) {
        //     Keyboard.dismiss();
        // }
    };

    // Handles typing logic
    const keyPress = (key, id) => {
        const newValues = [...values];
        const backspacePressed = (key === "Backspace");
        const lastField = id < length - 1;
        const currentFieldEmpty = newValues[id] === "";
        const notKeyPress = backspacePressed || !lastField || currentFieldEmpty;
        if(notKeyPress) return;
        
        newValues[id + 1] = key.toUpperCase();
        setValues(newValues);
        onChange?.(newValues.join(""));
        inputs.current[id + 1].focus();

    };

    return (
        <View className="flex-row justify-around">
            {values.map((val, id) => (
                <TextInput
                    className="border-2 w-12 h-12 rounded-xl text-lg text-center"
                    style={{ borderColor: error ? 'red' : "black" }} 
                    key={id}
                    value={val}
                    maxLength={1}
                    ref={(el) => (inputs.current[id] = el)}
                    onKeyPress={({ nativeEvent }) => {keyPress(nativeEvent.key, id)}}
                    onChangeText={(text) => handleChange(text, id)}
                    keyboardType="visible-password"
                    textAlign="center"
                />
            ))}
        </View>
    );
}


