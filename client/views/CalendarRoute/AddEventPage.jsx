import React, { useState } from 'react';
import { Alert, StatusBar, View, Image, FlatList, StyleSheet } from 'react-native';
import { Appbar, Banner, TextInput, Card, Button, Text } from 'react-native-paper';
import { imageUriParser } from '../../utils/urlParser';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOutfitsData } from '../../stores/UserStore';


export const AddEventPage = ({ route, navigation }) => {
    const { selectedDate } = route.params;
    const [visible, setVisible] = useState(false);

    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const outfits = React.useMemo(() =>
        user.userInfo.data?.outfits_collections ? user.userInfo.data.outfits_collections : [], [user.userInfo.data?.outfits_collections]
    );

    const [name, setName] = React.useState("");
    const [occasion, setOccasion] = React.useState("");

    useFocusEffect(
        React.useCallback(() => {
          if (navigation.isFocused()) {
            dispatch(fetchOutfitsData(user.userInfo._id));
          }
        }, [navigation.isFocused()])
      );

    const addEvent = () => {
        // push a new Item to the specific date
        setVisible(true);
        console.log('added')
    }

    const onAdd = () => {
        Alert.alert('Add New Event', 'Are you sure to submit?', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {text: 'Confirm', onPress: () => addEvent()},]);
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
            Added successfully! 
        </Banner>
        <TextInput label="Name" value={name} onChangeText={text => setName(name)}/>
        <TextInput label="Occasion (Optional)" value={occasion} onChangeText={text => setOccasion(occasion)}/>
        <FlatList
            // key={`${displayedItems.length}items`}
            style={{ width: '100%' }}
            // contentContainerStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}
            numColumns={1}
            directionalLockEnabled={true}
            data={(outfits && outfits.length === 0) ? [] : outfits[0].outfits}
            renderItem={({ item }) => (
              <Card
                contentStyle={{ marginTop: 5 }}
                style={{ marginBottom: 10, alignSelf: 'center', width: Dimensions.get('window').width * 0.85 }}
                mode='outlined'
              >
                <View style={{ marginHorizontal: 5 }}>
                  <FlatList
                    key={`OutfitRoute-${numColumns}`}
                    // style={{ flex: 1 }}
                    numColumns={numColumns}
                    directionalLockEnabled={true}
                    data={item.items}
                    renderItem={({ item }) => (
                      <View>
                        <Image
                          source={{
                            uri: imageUriParser(item._id),
                          }}
                          style={{
                            width: IMAGE_WIDTH,
                            height: IMAGE_WIDTH,
                            resizeMode: 'stretch',
                            margin: 1,
                          }} />
                      </View>
                    )}
                    keyExtractor={(item) => item._id}
                  />
                </View>
                <Card.Title
                  title={item.name ? item.name : `Outfit(${item._id})`}
                  subtitle={`created at ${item.created_time ? item.created_time : ''}`}
                />
              </Card>
            )}
            keyExtractor={(item) => item._id}
          />
        <Button onPress={() => onAdd()}>Confirm</Button>
        <Button textColor='#f05353' onPress={() => onCancel()}>Cancel</Button>
        </View>
    )

}