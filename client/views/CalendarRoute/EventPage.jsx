import React, { useState } from 'react';
import { Alert, StatusBar, View, Image, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { Appbar, Banner, FAB, Avatar, Button, Text, Card } from 'react-native-paper';
import { getOutfit } from '../../api/requests';

const LeftContent = props => <Avatar.Icon {...props} icon="tshirt-crew" />

export const EventPage = ({ route, navigation }) => {
    const { item, userId, selectedDate } = route.params;
    const [visible, setVisible] = useState(false);
    const [imageUris, setImageUris] = useState([]);
    const [isItemLoaded, setIsItemLoaded] = useState(false);

    const getItemImages = async () => {
      await getOutfit(userId, item.planned_outfits[0]).then((data) => {
        var uri_list = imageUris;
        for(var i = 0; i < data.outfit.items.length; i++){
          var item = {};
          item['id'] = i;
          item['name'] = data.outfit.items[i].name;
          item['uri'] = imageUriParser(data.outfit.items[i]._id);
          uri_list.push(item);
        }
        setImageUris(uri_list);
      });
    }

    if (isItemLoaded) {
      getItemImages();
      setIsItemLoaded(true);
    }

    const renderItem = (item, index) => {
      return(
        <View>
          <Card>
          <Card.Title title={imageUris[index]['name']} left={LeftContent} />
          <Card.Content>
          </Card.Content>
          <Card.Cover source={{ uri: imageUris[index]['uri'] }} />
          </Card>
        </View>
      );
    }


    const onEdit = () => {
        navigation.navigate("Calendar-edit-item", {
            item: item,
            selectedDate: selectedDate,
          });
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
        <Text variant="bodyMedium">Created Time: {item.createdTime}</Text>
        {item.occasion != undefined && item.occasion !== null && 
        <Text variant="bodyMedium">Occasion: {item.occasion}</Text>}
        <SafeAreaView style={styles.container}>
          <FlatList
            data={imageUris}
            renderItem={(item, index) => {
              return renderItem(item, index);}}
            keyExtractor={item => item.id}
          />
        </SafeAreaView>

        <Button onPress={() => onEdit()}>Edit</Button>
        <Button textColor='#f05353' onPress={() => onDelete()}>Delete</Button>
    </View>
    );
}

const styles = StyleSheet.create({

  });