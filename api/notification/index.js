import * as  Notifications from 'expo-notifications';
import moment from 'moment';

export async function createNotificationChannel() {
    await Notifications.setNotificationChannelAsync('alarm-test-channel', {
      name: 'alarm-test-channel',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default', // or provide a custom sound
      vibrate: [0, 250, 250, 250], // vibration pattern
    }).then(res=>{
        return res;
    }).catch(err=>{
        console.log(err);
    });
}

export function sendNotification(channel, summary, fullDate) {
    return new Promise(async (resolve, reject) => {
        const current = moment().format("YYYY-MM-DD") + 'T' + new Date().toLocaleTimeString() + '.000Z';
        let timeDif = new Date(fullDate) - new Date(current);
        timeDif /= 1000;
        console.log('after ', timeDif, 's');
        
        if (timeDif > 0) {
            try {
                const res = await Notifications.scheduleNotificationAsync({
                    content: {
                        title: "Logiアラーム",
                        body: summary,
                        attachments: [
                            {
                              uri: '', // Replace with your image URL
                            },
                          ],
                    },
                    trigger: {
                        seconds: timeDif, // Use the calculated time difference
                        channelId: channel,
                    },
                });
                resolve(res); // Resolve the promise with the result
            } catch (err) {
                console.log('cannot send notification', err);
                reject(err); // Reject the promise with the error
            }
        } else {
            reject(new Error('The specified date is in the past.'));
        }
    });
}

export function cancelNotification(identifier) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await Notifications.cancelScheduledNotificationAsync(identifier);
            resolve(res); // Resolve the promise with the result
        } catch (err) {
            console.log(err);
            reject(err); // Reject the promise with the error
        }
    });
}

export async function cancelAllNotifications(channel){
    Notifications.getAllScheduledNotificationsAsync().then(res=>{
        res.forEach(element => {
            if(element.trigger.channelId == channel){
                Notifications.cancelScheduledNotificationAsync(element.identifier);
            }
        });
    })
}

export async function deleteNotificationChannel(channel) {
    await Notifications.deleteNotificationChannelAsync(channel).then(res=>{
        return res;
    }).catch(err=>{
        console.log(err);
    });
  }

export async function listNotificationChannels() {
    Notifications.getNotificationChannelAsync().then(res=>{
        return res;
    }).catch(err=>{
        console.log(err);
    })
}

export async function updateNotificationChannel(channel) {
    await Notifications.setNotificationChannelAsync(channel, {
      name: 'Updated Channel Name',
      importance: Notifications.AndroidImportance.DEFAULT, // change importance
      sound: 'new-sound', // new sound
    });
}