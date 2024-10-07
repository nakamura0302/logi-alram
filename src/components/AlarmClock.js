import { View, Text, Switch, Image, StyleSheet, Animated, TouchableOpacity, Dimensions, ToastAndroid} from 'react-native'
import { React, useState, useEffect, useRef } from 'react'
import { formatNumber } from '../../api/Utils';
import { colors } from '../../api/ColorPallete';
import moment from 'moment';
const AlarmClock = ({ id, alarm, ymd, summary, hour, minute, editable, identifier, active, editAlarm, cancelAlarm, sendAlarm }) => {

  const [isActive, setIsActive] = useState(active?true:false);

  const screenHeight = Dimensions.get("window").height;
  const expansionHeight = useRef(new Animated.Value(screenHeight / 8)).current;

  const toggleActive = (e) =>{
    setIsActive(e);
    if(e){
      const tmp = {...alarm, active:1,};
      sendAlarm(tmp);
    }else{
      const tmp = {...alarm, active:0,};
      cancelAlarm(tmp);
    }
  }

  const edit = () => {
    /**
     * if selected alarm is editable one, it means alarm created on phone, not on web
     */
    if(editable == 1){
      editAlarm(alarm);
    }else{
      ToastAndroid.show('このアラームは編集できません。', ToastAndroid.SHORT);
    }
  }

  return (
    <TouchableOpacity onPress={()=>{edit()}}>

    <Animated.View style={[theme.container, { height: expansionHeight}]}>
        <View style={[theme.section, {flex: 4,}]}>
          <Text style={[theme.title, {color: isActive?colors.black:colors.darkgray}]}>{`${moment(ymd).format('YYYY年M月D日')}  ${formatNumber(hour)}:${formatNumber(minute)}`}</Text>
          <Text style={[theme.summary, {color: isActive?colors.darkgray:colors.gray,}]} numberOfLines={1}>{summary==''?'要約なし':summary}</Text>
        </View>
        <View style={[theme.section, {flex: 1, }]}>
          <Switch style={theme.switch} trackColor={{ false: colors.gray, true: colors.blue }} thumbColor={isActive ? colors.darkgray : colors.darkgray} onValueChange={toggleActive} value={isActive} />
        </View>
    </Animated.View>
    </TouchableOpacity>
  )
}

export default AlarmClock

const theme = StyleSheet.create({
  container: { 
    flex: 1, 
    flexDirection: 'row', 
    paddingHorizontal: 20, 
    margin: 5, 
    paddingBottom: 10, 
    padding: 5, 
    borderRadius: 20,
    backgroundColor: 'white',
  },
  section: { 
    flexDirection: "column", 
    justifyContent: "center", 
    marginVertical: 2 
  },
  switch:{
    
  },
  title: { fontSize: 25, margin:0, },
  summary: {
    fontSize: 20, 
    margin: 0, 
    padding:0,
    overflow: 'hidden',
        textOverflow: 'ellipsis',
  },
  desc:{fontSize: 15},
  image: { width: 20, height: 20,}
})
