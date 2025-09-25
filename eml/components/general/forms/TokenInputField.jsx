    import React, { useState, useRef } from "react";
    import { View, TextInput, StyleSheet, Keyboard } from "react-native";
    import ShowAlert from "../ShowAlert";

    export default function TokenInputField({ length = 6, onChange }) {
    const [values, setValues] = useState(Array(length).fill("")); // ["", "", "", "", "", ""]
    const inputs = useRef([]);

    const keyPress = (key, id) => {
        const newValues = [...values];  
        if(key === "Backspace" &&  id >= 0){
            console.log("Backspace id: " + id);
            if(id === length - 1 && newValues[id] !== ""){
                newValues[id] = "";
                setValues(newValues);
                return;
            }

            newValues[id - 1] = "";
            inputs.current[id - 1].focus();
            setValues(newValues);
        } else {
            if(newValues[id] !== "" && id === length - 1) return;
            newValues[id] = key;   
            if(id !== length - 1){
            inputs.current[id + 1].focus();
            }
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
                    onKeyPress={({ nativeEvent }) => {
                        const idFocused = inputs.current.findIndex((input) => input.isFocused());
                        keyPress(nativeEvent.key, idFocused);
                    }}
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


