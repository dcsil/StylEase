import React, {useState} from 'react';
import {Agenda} from 'react-native-calendars';
import { View, StatusBar, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { Appbar, Card, FAB, Avatar, Button, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import outfit1 from './outfit1.jpg';
import outfit2 from './outfit2.jpg';
import outfit3 from './outfit3.jpg';
import { useDispatch, useSelector } from 'react-redux';

const LeftContent = props => <Avatar.Icon {...props} icon="folder" />

const log = console.log

export const CalendarRoute = ({ navigation }) => {
    const [items, setItems] = useState();
    var curr_date = new Date();
    const current_date = {
      dateString: curr_date.toJSON().slice(0, 10),
      day: curr_date.getDay(),
      month: curr_date.getMonth(),
      timestamp: curr_date.getTime(),
      year: curr_date.getFullYear()
    }
    const [selectedDate, setSelectedDate] = useState(current_date);
    const [userOutfits, setUserOutfits] = useState();

    const user = useSelector(state => state.user);
    const outfits = user.outfits;
    // setUserOutfits(outfits);r

    // TODO: API fetch items from calendar. 
    // setItems(items);

    const renderItem = (item) => {
      return(
        <Card style={[styles.item]} 
        onPress = {() => navigation.navigate('Event-item', {
          item: item,
          selectedDate: selectedDate,
        })}
        >
          <Card.Title title={item.occasion} left={LeftContent} />
          <Card.Content>
            <Text variant="titleLarge">{item.name}</Text>
            <Text variant="bodyMedium">{item.locaiton}</Text>
          </Card.Content>
          <Card.Cover source={item.path} />
        </Card>
      );
    }

    const renderEmptyDate = () => {
      console.log('render empty');
      return (
        <View style={styles.emptyDate}>
          <Text>This is empty date!</Text>
        </View>
      );
    }

    const renderKnob = () => {
      return (
        <View style = {{alignItems: 'center'}}>
          <View style = {styles.knob}/>
        </View>
      );
    }

    return(
    <View>
        <StatusBar style="auto" />
        <Appbar.Header statusBarHeight={20} style={{ paddingBottom: 0 }}>
        <Appbar.Content title="Calendar" />
        </Appbar.Header>
        <View style={{height: '90%'}}>
        <Agenda
          items={{
            '2023-04-08': [{name: 'Outfit1', createdTime:new Date(), occasion: 'Date', Location: 'Alo', path: outfit1}],
            '2023-04-09': [{name: 'Outfit2', createdTime:new Date(), occasion: 'Ball Night', Location: 'School', path: outfit2}, 
                           {name: 'Outfit3', createdTime:new Date(), path: outfit3}]
          }}
          loadItemsForMonth={month => {
            return;
          }}
          onCalendarToggled={calendarOpened => {
            return;
          }}
          selected={new Date().toJSON().slice(0, 10)}
          onDayPress={(day) => {
            setSelectedDate(day);
            log();
          }}
          onDayChange={(day) => {
            setSelectedDate(day);
          }}
          showOnlySelectedDayItems={true}
          pastScrollRange={50}
          futureScrollRange={50}
          renderItem={(item, firstItemInDay) => {
            return renderItem(item);
          }}
          renderEmptyDate={() => {
            return renderEmptyDate();
          }}
          renderKnob={() => {
            return renderKnob();
          }}
          renderEmptyData={() => {
            return <View />;
          }}
          rowHasChanged={(r1, r2) => {
            return r1.text !== r2.text;
          }}
          hideKnob={false}
          showClosingKnob={true}
          theme={{
            todayTextColor: '#6a5acd',
            dayTextColor: '#2d4150',
            selectedDayBackgroundColor: '#6a5acd',
            agendaTodayColor: '#6a5acd',
            dotColor: '#6a5acd',
          }}
      />
      </View>
      <FAB
        style={styles.fab}
        icon={(props) => <Icon name="plus" {...props} />}
        onPress={() => navigation.navigate('Add-event-item', {
          selectedDate: selectedDate,
        })}
      />
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
    marginBottom: 17,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  },
  knob: {
    backgroundColor: '#d9dcda',
    width: 30,
    height: 3,
    borderColor: '#d9dcda',
    borderWidth: 2,
    borderRadius: 9,
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});