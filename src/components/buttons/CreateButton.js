import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../../../api/ColorPallete';

const CreateButton = ({ title, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.button}>
            <Text style={styles.text}>{'+'}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
        borderRadius: 30,
        elevation: 3,
        backgroundColor: colors.blue,
        position: 'absolute',
        bottom: 80,
        right: 50,
    },
    text: {
        fontSize: 30,
        color: 'white',
    }
});

export default CreateButton;