import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { colors } from '../../../api/ColorPallete';

const CircuralSelectorButton = ({ name, onPress, styles }) => {
    return (
        <TouchableOpacity style={[styles, theme.container]} onPress={onPress}>
            <Text style={{ color: 'white'}}>{name}</Text>
        </TouchableOpacity >
    )
}

export default CircuralSelectorButton

const theme = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderRadius: 250,
    },
})