import { useState } from "react"
import { View, Text } from "react-native"
import AlarmClock from "./AlarmClock"

const AlarmClocksList = ({ alarms, editAlarm, cancelAlarm, sendAlarm }) => {
    return (
        <View>
            {alarms.map((alarm, i) => 
                <AlarmClock 
                    key={i}
                    alarm={alarm}
                    id={alarm.id} 
                    summary={alarm.summary}
                    ymd={alarm.ymd}
                    hour={alarm.hour} 
                    minute={alarm.minute} 
                    editable={alarm.editable}
                    identifier={alarm.identifier}
                    active={alarm.active}
                    editAlarm={editAlarm}
                    cancelAlarm={cancelAlarm}
                    sendAlarm={sendAlarm}
                />
            )}
        </View>
    )
}

export default AlarmClocksList
