import React, { useState } from 'react';
import { Alert, StatusBar, View, Image, StyleSheet } from 'react-native';
import { Appbar, Banner, FAB, Avatar, Button, Text } from 'react-native-paper';

export const EventPage = ({ route, navigation }) => {
    const { item, selectedDate } = route.params;
    const [visible, setVisible] = useState(false);


    const onEdit = () => {

    }

    const deleteItem = () => {
        // TODO: Delete item API
        setVisible(true);
        console.log('deleted')
    }

    const onDelete = () =>
        Alert.alert('Delete', 'Are you sure want to delete this scheduled outfit?', [
        {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
        },
        {text: 'Confirm', onPress: () => deleteItem()},
    ]);

    return(
    <View>
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
            Deleted successfully! 
        </Banner>
        <Text variant="titleLarge">{item.name}</Text>
        <Text variant="bodyMedium">Created Time: {item.createdTime.toDateString()}</Text>
        {item.occasion != undefined && item.occasion !== null && 
        <Text variant="bodyMedium">Occasion: {item.occasion}</Text>}
        {item.Location != undefined && item.Location !== null && 
        <Text variant="bodyMedium">Location: {item.Location}</Text>}

        <Button onPress={() => onEdit()}>Edit</Button>
        <Button textColor='#f05353' onPress={() => onDelete()}>Delete</Button>
    </View>
    );
}

const styles = StyleSheet.create({

  });