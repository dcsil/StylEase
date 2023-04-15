import React, { useState, useEffect } from 'react';
import { Alert, StatusBar, View, StyleSheet, FlatList } from 'react-native';
import { Appbar, Banner, Avatar, Button, Text, Card } from 'react-native-paper';
import { deletePlan, getOutfit } from '../../api/requests';
import { imageUriParser } from '../../utils/urlParser';

const LeftContent = props => <Avatar.Icon {...props} icon="tshirt-crew" />

export const EventPage = ({ route, navigation }) => {
    const { item, userId, selectedDate } = route.params;
    const [visible, setVisible] = useState(false);
    const [imageUris, setImageUris] = useState([]);
    const [isItemLoaded, setIsItemLoaded] = useState(false);
    const [planName, setPlanName] = useState(item.name);
    const [planOccasion, setPlanOccasion] = useState(item.occasion);

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

    if (!isItemLoaded) {
      getItemImages();
      setIsItemLoaded(true);
    }

    useEffect(() => {
      renderPage();
   }, [imageUris])

    const renderItem = (item) => {
      return(
        <View>
          <Card style={[styles.item]}>
          <Card.Title title={item.item['name']} left={LeftContent} />
          <Card.Content>
          </Card.Content>
          <Card.Cover source={{ uri: item.item['uri'] }} />
          </Card>
        </View>
      );
    }


    const onEdit = () => {
        navigation.navigate("Calendar-edit-item", {
            item: item,
            userId: userId,
            selectedDate: selectedDate,
            setPlanName: setPlanName,
            setPlanOccasion: setPlanOccasion,
          });
    }

    const deleteItem = async () => {
        await deletePlan(item.planId, item.dayId).then(()=>{
          setVisible(true);
          console.log('deleted');
        }
        )
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

    const renderPage = () => {
      return(
        <View style={{flex: 1}}>
            <StatusBar barStyle="auto" />
            <Appbar.Header statusBarHeight={20} style={{ paddingBottom: 0 }}>
              <Appbar.BackAction onPress={() => 
              { 
                navigation.goBack() 
              }} />
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
            <Text variant="titleLarge">{planName}</Text>
            <Text variant="bodyMedium">Created Time: {item.createdTime}</Text>
            {planOccasion != "" && planOccasion !== null && 
            <Text variant="bodyMedium">Occasion: {planOccasion}</Text>}
            <FlatList
              data={imageUris}
              renderItem={(item) => {
                return renderItem(item);
              }}
              keyExtractor={item => item.id}
            />
    
            <Button onPress={() => onEdit()}>Edit</Button>
            <Button textColor='#f05353' onPress={() => onDelete()}>Delete</Button>
        </View>
        );
    }

    return renderPage();
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 5,
  },
});