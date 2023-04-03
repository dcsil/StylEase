import React, {useState} from 'react';
import {Agenda, calendarTheme} from 'react-native-calendars';
import { View, StatusBar, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Appbar } from 'react-native-paper';



export const CalendarRoute = ({ navigation }) => {
    state = {
      items: {
        '2023-04-22': [{name: 'item 1 - any js object'}],
        '2023-04-23': [{name: 'item 2 - any js object', height: 80}],
        '2023-04-24': [],
        '2023-04-25': [{name: 'item 3 - any js object'}, {name: 'any js object'}]
      }
    };
    const [selected, setSelected] = useState('');
    const renderItem = (item) => {
      console.log('render item', item);

      return(
        <TouchableOpacity
        style={[styles.item, { height: 80 }]}
        onPress={() => Alert.alert(item.name)}
      >
        <Text style={styles.name}>{item.name}</Text>
      </TouchableOpacity>);
    }

    const renderEmptyDate = () => {
      console.log('render empty');
      return (
        <View style={styles.emptyDate}>
          <Text>This is empty date!</Text>
        </View>
      );
    }

    return(
    <View>
        <StatusBar style="auto" />
        <Appbar.Header statusBarHeight={20} style={{ paddingBottom: 0 }}>
        <Appbar.Content title="Calendar" />
        </Appbar.Header>
        {/* <Calendar
          onDayPress={day => {
            setSelected(day.dateString);
            console.log(day);
          }}
          markedDates={{
            [selected]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}
          }}
        /> */}
        <View style={{height: 600}}>
        <Agenda
          // The list of items that have to be displayed in agenda. If you want to render item as empty date
          // the value of date key has to be an empty array []. If there exists no value for date key it is
          // considered that the date in question is not yet loaded
          items={{
            '2023-03-22': [{name: 'item 1 - any js object'}],
            '2023-04-02': [{name: 'item 2 - any js object', height: 80}],
            '2023-04-03': [],
            '2023-04-04': [{name: 'item 3 - any js object'}, {name: 'any js object'}]
          }}
          loadItemsForMonth={month => {
            console.log('trigger items loading');
          }}
          onCalendarToggled={calendarOpened => {
            console.log(calendarOpened);
          }}
          // Initially selected day
          selected={new Date().toJSON().slice(0, 10)}
          onDayPress={(day) => {
            console.log('day pressed');
          }}
          onDayChange={(day, item) => {
            console.log('day changed');
            
          }}
          // Max amount of months allowed to scroll to the past. Default = 50
          pastScrollRange={50}
          // Max amount of months allowed to scroll to the future. Default = 50
          futureScrollRange={50}
          // Specify how each item should be rendered in agenda
          renderItem={(item, firstItemInDay) => {
            return renderItem(item);
          }}
          // // Specify how each date should be rendered. day can be undefined if the item is not first in that day
          // renderDay={(day, item) => {
          //   return <View><Text>{day ? day.day: 'item'}</Text></View>;
          // }}
          renderEmptyDate={() => {
            return renderEmptyDate();
          }}
          renderKnob={() => {
            return (
              <View style = {{alignItems: 'center'}}>
                <View style = {{
                  backgroundColor: '#d9dcda',
                  width: 30,
                  height: 3,
                  borderColor: '#d9dcda',
                  borderWidth: 2,
                  borderRadius: 9,
                  justifyContent: 'center', }}/>
              </View>
            );
          }}
          // Specify what should be rendered instead of ActivityIndicator
          renderEmptyData={() => {
            return <View />;
          }}
          // Specify your item comparison function for increased performance
          rowHasChanged={(r1, r2) => {
            return r1.text !== r2.text;
          }}
          // // Hide knob button. Default = false
          hideKnob={false}
          // When `true` and `hideKnob` prop is `false`, the knob will always be visible and the user will be able to drag the knob up and close the calendar. Default = false
          showClosingKnob={true}
          style={{}}
      />
      </View>
    </View>
    );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
    height: 100
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  }
});