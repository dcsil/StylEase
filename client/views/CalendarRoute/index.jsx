import React, {useState} from 'react';
import {Agenda} from 'react-native-calendars';
import { View, StatusBar, TouchableOpacity, StyleSheet, Text, Alert, Image } from 'react-native';
import { Appbar } from 'react-native-paper';
import outfit1 from './outfit1.jpg';
import outfit2 from './outfit2.jpg';
import outfit3 from './outfit3.jpg';



export const CalendarRoute = ({ navigation }) => {
    const renderItem = (item) => {
      console.log('render item', item);
      return(
        <TouchableOpacity
        style={[styles.item]}
        onPress={() => Alert.alert(item.name)}
      >
        <Text style={styles.name}>{item.name}</Text>
        <Image style = {styles.stretch} source={item.path} />
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
        <View style={{height: 600}}>
        <Agenda
          items={{
            '2023-04-03': [{name: 'Date outfit', path: outfit1}],
            '2023-04-05': [{name: 'Ball Night', path: outfit2}, {name: 'Y2K', path: outfit3}]
          }}
          loadItemsForMonth={month => {
            console.log('trigger items loading');
          }}
          onCalendarToggled={calendarOpened => {
            console.log(calendarOpened);
          }}
          selected={new Date().toJSON().slice(0, 10)}
          onDayPress={(day) => {
            console.log('day pressed');
          }}
          onDayChange={(day, item) => {
            console.log('day changed');
            
          }}
          pastScrollRange={50}
          futureScrollRange={50}
          renderItem={(item, firstItemInDay) => {
            return renderItem(item);
          }}
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
          renderEmptyData={() => {
            return <View />;
          }}
          rowHasChanged={(r1, r2) => {
            return r1.text !== r2.text;
          }}
          hideKnob={false}
          showClosingKnob={true}
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
    height: 300
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  },
  stretch: {
    width: '100%',
    height: '90%',
    resizeMode: 'cover',
  },
});