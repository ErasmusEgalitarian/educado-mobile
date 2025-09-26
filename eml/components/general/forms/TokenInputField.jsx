    import React, { useState, useRef } from "react";
    import { View, TextInput, StyleSheet, Keyboard } from "react-native";
    import ShowAlert from "../ShowAlert";

    export default function TokenInputField({ length = 6, onChange }) {
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

        if(backspacePressed) return;
        if(!lastField) return;
        if(currentFieldEmpty) return;

        newValues[id + 1] = key.toUpperCase();
        setValues(newValues);
        inputs.current[id + 1].focus();

    };

    return (
        <View style={styles.container}>
            {values.map((val, id) => (
                <TextInput
                    key={id}
                    style={styles.input}
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

const styles = StyleSheet.create({
    container:{
        flexDirection: "row",
        justifyContent: "center",
    },
    input: {
        width: 50,
        height: 50,
        borderWidth: 2,
        borderRadius: 10,
        fontSize: 20,
        borderColor: "lightgrey",
        marginHorizontal: 6,
    },
});


