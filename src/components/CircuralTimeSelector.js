import { View, Text, StyleSheet, Vibration } from 'react-native'
import React, { useEffect, useState } from 'react'
import CircuralSelectorButton from './buttons/CircuralSelectorButton'
import { colors } from '../../api/ColorPallete';


const CircuralTimeSelector = ({ setHour, setMinute, isSelected }) => {

    const hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    const hoursAdditional = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0]

    const minutes = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 0]
    const conv = 2 * Math.PI / hours.length
    const ray = 130

    const [lastNumber, setLastNumber] = useState(0)
    const [index, setIndex] = useState(1)

    useEffect(() => setIndex(1), [lastNumber])

    if(isSelected=='hour') {
        return (
            <View style={theme.container}>
                {hours.map((num, i) => {
                    return <CircuralSelectorButton key={i} name={num} styles={{
                        position: 'absolute',
                        left: Math.cos(conv * (i + 1) - Math.PI / 2) * ray,
                        top: Math.sin(conv * (i + 1) - Math.PI / 2) * ray,
                        width: 50, height: 50, backgroundColor: colors.blue
                    }} onPress={() => {
                        setHour(num);
                        Vibration.vibrate();
                    }} />
                })}

                <View style={{ position: 'absolute', left: 12.5, top: 12.5 }}>
                    {hoursAdditional.map((num, i) => {
                        return <CircuralSelectorButton key={i} name={num} styles={{
                            position: 'absolute',
                            left: Math.cos(conv * (i + 1) - Math.PI / 2) * ray / 1.7,
                            top: Math.sin(conv * (i + 1) - Math.PI / 2) * ray / 1.7,
                            width: 30, height: 30, backgroundColor: colors.blue
                        }} onPress={() => {
                            setHour(num);
                            Vibration.vibrate();
                        }} />
                    })}
                </View>
            </View>
        )
    } else if(isSelected=='min'){
        return (
            <View style={theme.container}>
                {minutes.map((num, i) => {
                    return <CircuralSelectorButton key={i} name={num} styles={{
                        position: 'absolute',
                        left: Math.cos(conv * (i + 1) - Math.PI / 2) * ray,
                        top: Math.sin(conv * (i + 1) - Math.PI / 2) * ray,
                        width: 50, height: 50, backgroundColor: colors.blue
                    }} onPress={() => {
                        setLastNumber(num);
                        num !== lastNumber ? setIndex(1) : null
                        num !== lastNumber ? setMinute(num) : setMinute(num + index);
                        setIndex(index < 5 ? index + 1 : 1);

                        Vibration.vibrate()

                    }} />

                })}
            </View>
        )
    }
}

export default CircuralTimeSelector

const theme = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', position: 'absolute', left: '-5%', top: '40%' },
})