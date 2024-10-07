import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import ModiButton from '../components/buttons/ModiButton';
import React, { useState, useEffect } from 'react'
import { Database } from '../../api/Database';
import CircuralTimeSelector from '../components/CircuralTimeSelector';
import { formatNumber} from '../../api/Utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Calendar from '../components/Calendar';
import {sendNotification, cancelNotification} from '../../api/notification';
import { colors } from '../../api/ColorPallete';
import moment from 'moment';

const AlarmCreator = ({ route, navigation }) => {

    const {selectedAlarm} = route.params;
    const [ymd, setYmd] = useState(selectedAlarm?selectedAlarm.ymd:(new Date().getFullYear()+'-'+formatNumber(new Date().getMonth()+1)+'-'+formatNumber(new Date().getDate())));
    const [hour, setHour] = useState(selectedAlarm?selectedAlarm.hour:new Date().getHours());
    const [minute, setMinute] = useState(selectedAlarm?selectedAlarm.minute:new Date().getMinutes());
    const [isSelected, setIsSelected] = useState('ymd');
    const [fullDate, setFullDate] = useState(selectedAlarm?selectedAlarm.fullDate:'');
    const [summary, setSummary] = useState(selectedAlarm?selectedAlarm.summary:'');

    useEffect(()=>{
        const tmp = ymd+'T'+formatNumber(hour)+':'+formatNumber(minute)+':00.000Z';
        setFullDate(tmp);
    }, [ymd, hour, minute])

    async function addAlarm(){
        if(summary=='') {
            ToastAndroid.show('概要を入力してください', ToastAndroid.SHORT);
            return;
        }
        const uid = await AsyncStorage.getItem('uid');
        await sendNotification(uid, summary, fullDate).then(res=>{
            Database.add(summary, fullDate, ymd, hour, minute, 1, res, 1);
            navigation.goBack();
          }).catch(err=>{
            ToastAndroid.show('それは未来の時間に違いない', ToastAndroid.SHORT);
            console.log('can not add alarm:', err);
          }
        );
    }

    async function editAlarm(){
        const userId = await AsyncStorage.getItem('uid');
        Database.getAll().then(res=>{
            const indexAlarm = res.find(item => item.id == selectedAlarm.id);
            cancelNotification(indexAlarm.identifier);
            sendNotification(userId, summary, fullDate).then(response=>{
                Database.update(selectedAlarm.id, summary, fullDate, ymd, hour, minute, selectedAlarm.editable, response, selectedAlarm.active);
                navigation.goBack();
              }).catch(err=>{
                  ToastAndroid.show('アラームを編集できません', ToastAndroid.SHORT);
                  console.log('can not edit alarm:', err);
              }
            );
        })
    }

    const removeAlarm = () => {
        Database.getAll().then(res=>{
            const indexAlarm = res.find(item => item.id == selectedAlarm.id);
            cancelNotification(indexAlarm.identifier).then(response=>{
                Database.remove(selectedAlarm.id);
                navigation.goBack();
            }).catch(err=>{
                  ToastAndroid.show('can not delete notification', ToastAndroid.SHORT);
                  console.log('can not delete notification');
              }
            );
        })
    };

    return (
        <View style={theme.container}>
            <View style={{ flex: 1, flexDirection: 'column', marginTop: 20, width: '100%', }}>
                <TouchableOpacity onPress={() => setIsSelected('ymd')}>
                    <Text style={[theme.date, isSelected=='ymd' ? theme.selected : null]}>{moment(ymd).format('YYYY年M月D日')}</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent:'center'}}>
                    <TouchableOpacity onPress={() => setIsSelected('hour')}>
                        <Text style={[theme.title, isSelected=='hour' ? theme.selected : null]}>{formatNumber(hour)}</Text>
                    </TouchableOpacity>
                    <Text style={theme.title}>:</Text>
                    <TouchableOpacity onPress={() => setIsSelected('min')}>
                        <Text style={[theme.title, isSelected=='min' ? theme.selected : null]}>{formatNumber(minute)}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'column', alignItems: 'center'}}>
                    <View style={{ flexDirection: 'column', width: '90%'}}>
                        <Text style={[theme.summary, ]}>タイトル : </Text>
                    </View>
                    <TextInput
                        editable
                        multiline
                        numberOfLines={4}
                        style={[theme.inputDesc]}
                        placeholder="概要"
                        onChangeText={e=>{setSummary(e)}}
                        value={summary}
                        returnKeyType="done" // Change the return key type
                        blurOnSubmit={false} // Keep the input focused
                    />
                </View>
            </View>
            <View style={{ flex: 4, position: 'relative'}}>
                <Calendar setYmd={setYmd} isSelected={isSelected}/>
                <CircuralTimeSelector setHour={setHour} setMinute={setMinute} isSelected={isSelected} />
            </View>
            <View style={theme.buttons} >
                <ModiButton text={'キャンセル'} buttonColor={colors.darkgray} onPress={() => navigation.goBack()} />
                {selectedAlarm?
                    <ModiButton text={'編集'} buttonColor={colors.blue} onPress={() => editAlarm()} />
                :<ModiButton text={'追加'} buttonColor={colors.blue} onPress={() => addAlarm()} />}
                {selectedAlarm?
                    <ModiButton text={'削除'} buttonColor={'red'} onPress={() => removeAlarm()} />
                :null}
            </View >
        </View>
    )
}

export default AlarmCreator

const theme = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.gray, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 50, textAlign: 'center' , color: colors.black},
    date:{fontSize: 40, textAlign: 'center', color: colors.black},
    selected: { color: colors.blue },
    summary: {fontSize: 15,},
    inputDesc: {
        fontSize: 20, 
        // width: 360,
        width: '90%',
        maxHeight: 100, 
        borderColor: colors.lightgray, 
        borderWidth: 1,
        borderRadius: 10,
        padding: 10, 
        textAlignVertical: 'top',
    },
    button: { position: 'absolute', bottom: 70, left: Dimensions.get('window').width / 2 - 110 },
    buttons: { position: 'absolute', bottom: 70, flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    colors: { primary: '#2673d0' }
})