import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../../../api/ColorPallete';

const ModiButton = ({ onPress, text, buttonColor }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, {backgroundColor: buttonColor}]}>
            <Text style={[styles.text]}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 22,
        borderRadius: 30,
        elevation: 3,
        margin: 5
    },
    text: {
        color: 'white',
        fontSize: 16,
        lineHeight: 21,
        letterSpacing: 0.25,
    }
});

export default ModiButton;