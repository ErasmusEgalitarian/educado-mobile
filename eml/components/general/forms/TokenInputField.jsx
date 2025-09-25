    import React, { useState, useRef } from "react";
    import { View, TextInput, StyleSheet, Keyboard } from "react-native";
    import ShowAlert from "../ShowAlert";

    export default function TokenInputField({ length = 6, onChange }) {
    const [values, setValues] = useState(Array(length).fill("")); // ["", "", "", "", "", ""]
    const inputs = useRef([]);

    /* TODO: Want proper backspace handling????? -->
        onChangeText cannot detect keyboard events, and onKeyPress
        has limited android support, 3rd party library is needed
    */

    /*
    const handleChange = (value, id) => {
        if (!/^[0-9a-zA-Z]?$/.test(value)) return; // allow only a-z 0-9
        // Id is index
        const newValues = [...values];  
        newValues[id] = value;
        setValues(newValues);
        onChange?.(newValues.join(""));

        if(value && id < length - 1){
            inputs.current[id + 1].focus();
        }

        // hide keyboard when last input is filled
        if (value && id === length - 1) {
            Keyboard.dismiss();
        }
    };
    */

    const keyPress = (key, id) => {
        const newValues = [...values];  
        console.log(id);
        if(key === "Backspace" && id !== 0){
            inputs.current[id - 1].focus();
            newValues[id - 1] = "";
            setValues(newValues);
        } else {
            newValues[id] = key;   
            if(id !== length - 1) inputs.current[id + 1].focus();
            setValues(newValues);
        }
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
                    onKeyPress={({nativeEvent}) => keyPress(nativeEvent.key,id)}
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
