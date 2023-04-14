import React, {useState, useEffect} from 'react';
import {Agenda} from 'react-native-calendars';
import { View, StatusBar, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { Appbar, Card, FAB, Avatar, Button, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { getAllDays, getOutfit, getPlan } from '../../api/requests';
import { imageUriParser } from '../../utils/urlParser';
import UserStore from '../../stores/UserStore';

const LeftContent = props => <Avatar.Icon {...props} icon="folder" />

const log = console.log

export const CalendarRoute = ({ navigation }) => {
    const [items, setItems] = useState({});
    const [itemloaded, setItemloaded] = useState(false);
    var curr_date = new Date();
    const current_date = {
      dateString: curr_date.toJSON().slice(0, 10),
      day: curr_date.getDay(),
      month: curr_date.getMonth(),
      timestamp: curr_date.getTime(),
      year: curr_date.getFullYear()
    }
    const [selectedDate, setSelectedDate] = useState(current_date);
    const [coverUris, setcoverUris] = useState({});

    const user = useSelector(state => state.user);
    const userId = user.userInfo._id;

    const fetchCalendarDays = async (userId) => {
        if (!userId) return;
        await getAllDays(userId).then(async (data) => {
          const days = data.days;
          var items_ = {};
          for (let i = 0; i < days.length; i++){
            var plans = []
            for (let j = 0; j < days[i].plans.length; j++){
              const item = await getPlan(days[i].plans[j]);
              var p = item.plan;
              p['planId'] = days[i].plans[j];
              plans.push(p);
            }
            if(plans.length > 0) {
              items_[days[i].date] = plans;
            }
          }
          setItems(items_);
        });
    };

    const getCoverImage = async (outfitID) => {
      if(!outfitID) return;
      var uri;
      await getOutfit(userId, outfitID).then((data) => {
        uri = imageUriParser(data.outfit.items[0]._id);
        var curr_uriDict = coverUris;
        curr_uriDict[outfitID] = uri;
        setcoverUris(curr_uriDict);
      })
    }

    if (!itemloaded) {
      fetchCalendarDays(userId);
      setItemloaded(true);
    }

    useEffect(() => {
      renderPage();
   }, [items])

    const renderItem = (item) => {
      getCoverImage(item.planned_outfits[0]);
      return(
        <Card style={[styles.item]} 
        onPress = {() => navigation.navigate('Calendar-item', {
          item: item,
          userId: userId,
          selectedDate: selectedDate,
        })}
        >
          <Card.Title title={item.occasion} left={LeftContent} />
          <Card.Content>
            <Text variant="titleLarge">{item.name}</Text>
          </Card.Content>
          <Card.Cover source={{uri: coverUris[item.planned_outfits[0]]}} />
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

    const renderPage = () => { 
      return(
      <View>
        <StatusBar style="auto" />
        <Appbar.Header statusBarHeight={20} style={{ paddingBottom: 0 }}>
        <Appbar.Content title="Calendar" />
        </Appbar.Header>
        <View style={{height: '90%'}}>
        <Agenda
          items={items}
          loadItemsForMonth={month => {
            fetchCalendarDays(userId);
          }}
          selected={new Date().toJSON().slice(0, 10)}
          onDayPress={(day) => {
            setSelectedDate(day);
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
        onPress={() => navigation.navigate('Calendar-add-item', {
          selectedDate: selectedDate,
        })}
      />
    </View>);
    }
    
    // return renderPage();
    return(
    <View>
        <StatusBar style="auto" />
        <Appbar.Header statusBarHeight={20} style={{ paddingBottom: 0 }}>
        <Appbar.Content title="Calendar" />
        </Appbar.Header>
        <View style={{height: '90%'}}>
        <Agenda
          // items={{
          //   '2023-04-08': [{name: 'Outfit1', createdTime:new Date(), occasion: 'Date', Location: 'Alo', path: outfit1}],
          //   '2023-04-09': [{name: 'Outfit2', createdTime:new Date(), occasion: 'Ball Night', Location: 'School', path: outfit2}, 
          //                  {name: 'Outfit3', createdTime:new Date(), path: outfit3}]
          // }}
          // items = {{
          //   "2022-04-12": [{"createdTime": "2022-04-08", "date": "2022-04-12", "name": "Meeting with Professor Zhou", "occasion": "", "planned_outfits": [Array], "user": "64237961038602a02a81cd92"}, 
          //                  {"createdTime": "2022-04-08", "date": "2022-04-12", "name": "Professor Zhou's Birthday Party", "occasion": "", "planned_outfits": [Array], "user": "64237961038602a02a81cd92"}], 
          //   "2022-04-14": [{"createdTime": "2022-04-08", "date": "2022-04-14", "name": "CEO's Birthday Party", "occasion": "", "planned_outfits": [Array], "user": "64237961038602a02a81cd92"}]}}
          items={items}
          loadItemsForMonth={month => {
            fetchCalendarDays(userId);
          }}
          onCalendarToggled={calendarOpened => {
            return;
          }}
          selected={new Date().toJSON().slice(0, 10)}
          onDayPress={(day) => {
            setSelectedDate(day);
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
        onPress={() => navigation.navigate('Calendar-add-item', {
          userId: userId,
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