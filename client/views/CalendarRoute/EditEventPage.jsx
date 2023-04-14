import React, { useState } from 'react';
import { Alert, StatusBar, View, StyleSheet } from 'react-native';
import { Appbar, Banner, TextInput, Button } from 'react-native-paper';
import { updatePlan } from '../../api/requests';

export const EditEventPage = ({ route, navigation}) => {
    const { item, userId, selectedDate, setPlanName, setPlanOccasion } = route.params;
    const [visible, setVisible] = useState(false);

    const [name, setName] = React.useState(item.name);
    const [occasion, setOccasion] = React.useState(item.occasion);

    const editEvent = async () => {
        // TODO: push a new Item to the specific date
        const new_plan =  {
          "user": userId,
          "name": name,
          "date": item.date,
          "createdTime": new Date().toJSON().slice(0, 10),
          "planned_outfits": item.planned_outfits,
          "occasion": occasion
        }
        setPlanName(name);
        setPlanOccasion(occasion);

        await updatePlan(new_plan, item.planId).then(()=>{
          setVisible(true);
          console.log('added');
        })
    }

    const onEdit = () => {
        Alert.alert('Add New Event', 'Are you sure to submit?', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {text: 'Confirm', onPress: () => editEvent()},]);
    }

    const onCancel = () => {
        Alert.alert('Warning', 'Are you sure to cancel? \nAll the changes will not be saved', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {text: 'Confirm', onPress: () => navigation.goBack()},]);
    }

    return(
        <View style={styles.container}>
            <StatusBar barStyle="auto" />
            <Appbar.Header statusBarHeight={20} style={{ paddingBottom: 0 }}>
              <Appbar.BackAction onPress={() => { navigation.goBack() }} />
              <Appbar.Content title={selectedDate.dateString}/>
            </Appbar.Header>
            <Banner
            visible={visible}
            actions={[
              {
                label: 'OK',
                onPress: () => {
                    setVisible(false)
                    navigation.goBack()
                },
              },
            ]}>
            Edited successfully! 
        </Banner>
        <TextInput style={styles.textInput} label="Name" value={name} onChangeText={text => setName(text)}/>
        <TextInput style={styles.textInput} label="Occasion (Optional)" value={occasion} onChangeText={text => setOccasion(text)}/>
        <Button onPress={() => onEdit()}>Confirm</Button>
        <Button textColor='#f05353' onPress={() => onCancel()}>Cancel</Button>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    fab: {
      position: 'absolute',
      bottom: 20,
      right: 20,
    },
    textInput:{
      marginHorizontal: 5,
      marginVertical: 5
    }
  });

