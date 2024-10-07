import { View, ScrollView, StyleSheet, ToastAndroid} from 'react-native';
import CreateButton from '../components/buttons/CreateButton';
import { Database } from '../../api/Database';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import {db} from '../../firebase.config';
import AlarmClocksList from '../components/AlarmClocksList';
import { React, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {sendNotification, cancelNotification, cancelAllNotifications} from '../../api/notification';
import { colors } from '../../api/ColorPallete';
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';

const List = ({ navigation }) => {

    const [alarms, setAlarms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        /**
         * sync data to firebase
         */
        AsyncStorage.getItem('uid').then(userId=>{
            const q = query(collection(db, "schedule"), where('uid','==', `${userId}`));
            onSnapshot(q, (fireList) => {
                /**
                 * get all datas from sqlite for filtering
                 */
                Database.getAll().then((res) => {
                        /**
                     * filter local database
                     */
                    const filteredLocalList = res.filter(item=>item.editable == 1);
                    //remove all data of sql database
                    Database.removeAll();
                    /**
                     * cancel all notifications for new upgrading
                     */
                    cancelAllNotifications(userId);
                    /**
                     * map data of firebase's data to show data for app
                     */
                    let filteredFireList = [];
                    fireList.forEach(doc=>{
                        const item = doc.data();
                        const summary = item.title;
                        let fullDate = moment(item.dateTime.date, "YYYYMMDD").format("YYYY-MM-DD")+'T'+ item.dateTime.time.start+'.000Z';
                        console.log('first',fullDate, );
                        fullDate = (new Date(new Date(fullDate).getTime() - item.remindTime*60*1000)).toString();
                        const ymd = moment(item.dateTime.date, "YYYYMMDD").format("YYYY-MM-DD").toString();
                        const hour = parseInt(item.dateTime.time.start.split(':')[0]);
                        const minute = parseInt(item.dateTime.time.start.split(':')[1]);
                        const editable = 0;
                        const active = 1;
                        filteredFireList.push({summary, fullDate, ymd, hour, minute, editable, active});
                    })
                    /**
                     * combine two datas(firebase and local)
                     */
                    let combinedList = [...filteredLocalList, ...filteredFireList];
                    /**
                     * sort datas for ordering
                     */
                    combinedList.sort((one, another)=>{
                        return new Date(one.fullDate) - new Date(another.fullDate);
                    })
                    
                    /**
                     * send notifications and add to sqlite
                     */
                    combinedList.forEach(item=>{
                        sendNotification(userId, item.summary, item.fullDate).then(identifier=>{
                            Database.add(item.summary, item.fullDate, item.ymd, item.hour, item.minute, item.editable, identifier, item.active);
                        }).catch(err=>{
                            console.log('can not add notification');
                        });
                    })
                    /**
                     * show list and hide loading screen
                     */
                    setAlarms(combinedList);
                    setIsLoading(false)
                }).catch(err=>{
                    console.log('Can not load database', err);
                    setIsLoading(false);
                });
            });
        })
        
        navigation.addListener('focus', () => {
            Database.getAll().then(res => {
                let list = res;
                list.sort((one, another)=>{
                    return new Date(one.fullDate) - new Date(another.fullDate);
                })
                // save to state
                setAlarms(list);
            }).catch(err=>{
                console.log('can not get data from sql lite', err);
            });
        });
    }, []);

    const editAlarm = (alarm) =>{
        navigation.navigate('creator', {selectedAlarm: alarm});
    }

    async function sendAlarm(updatedAlarm){
        const uid = await AsyncStorage.getItem('uid');
        await sendNotification(uid, updatedAlarm.summary, updatedAlarm.fullDate).then(res=>{
            Database.update(updatedAlarm.id, updatedAlarm.summary, updatedAlarm.ymd, updatedAlarm.hour, updatedAlarm.minute, updatedAlarm.editable, res, updatedAlarm.active);
            console.log('Sent')
        }).catch(err=>{
              console.log('can not add notification');
          }
        );
    }

    async function cancelAlarm(updatedAlarm){
        Database.getAll().then(res=>{
            const indexAlarm = res.find(item => item.id == updatedAlarm.id);
            cancelNotification(indexAlarm.identifier).then(response=>{
                Database.update(updatedAlarm.id, updatedAlarm.summary, updatedAlarm.ymd, updatedAlarm.hour, updatedAlarm.minute, updatedAlarm.editable, '', updatedAlarm.active);
                console.log('Canceled')
            }).catch(err=>{
                  console.log('can not cancel notification');
                  ToastAndroid.show('can not cancel notification', ToastAndroid.SHORT);
              }
            );
        })
    }

    return (
        <View style={theme.container}>
            <ScrollView style={{ flex: 1, width: '100%', height: '100%'}}>
                <AlarmClocksList alarms={alarms} editAlarm={editAlarm} cancelAlarm={cancelAlarm} sendAlarm={sendAlarm}/>
            </ScrollView>
            <CreateButton onPress={() => navigation.navigate('creator', {selectedAlarm: null})} />
            <Spinner
                visible={isLoading}
                textContent={'読み込み中...'}
                overlayColor={colors.gray}
                color={colors.blue}
                textStyle={theme.spinnerTextStyle}
            />
        </View>
    )
}

const theme = StyleSheet.create({
    container: { 
        flex: 1, 
        flexDirection: 'column', 
        alignItems: 'center', 
        backgroundColor: colors.gray 
    },
    spinnerTextStyle: { color: colors.darkgray},
    colors: { black: '#000', white: 'white' },
});

export default List;