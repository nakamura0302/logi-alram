import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import {formatNumber} from '../../api/Utils';
import { colors } from '../../api/ColorPallete';

const Calendar = ({setYmd, isSelected}) => {

  const onDateChange = (date) => {
      const year = new Date(date).getFullYear();
      const month = formatNumber(new Date(date).getMonth()+1);
      const day = formatNumber(new Date(date).getDate());
      setYmd(year + '-' + month + '-' + day);
  };

  return (
        isSelected=='ymd'?
          <View style={styles.container}>
              <CalendarPicker 
                  onDateChange={onDateChange} 
                  previousTitle={'前'}
                  nextTitle={'次'}
                  weekdays={['日','月','火','水','木','金','土',]}
                  months={['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']}
                  todayTextStyle={{color:'white'}}
                  todayBackgroundColor={'lightblue'}
                  selectedDayColor= {colors.blue}
                  selectedDayTextColor={'white'}
              />
          </View>
        :null
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
  },
});

export default Calendar;
