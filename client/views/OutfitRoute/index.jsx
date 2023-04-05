import { Appbar, Button, Card, FAB, List, Modal, Portal } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'react-native-paper';

import styles from './styles';
import { FlatList, StatusBar, View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOutfitsData } from '../../stores/UserStore';
import { imageUriParser } from '../../utils/urlParser';

const IMAGE_WIDTH = 80;

export const OutfitRoute = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const outfits = React.useMemo(() =>
    user.userInfo.data?.outfits_collections ? user.userInfo.data.outfits_collections : [], [user.userInfo.data?.outfits_collections]
  );
  const [numColumns, setNumColumns] = React.useState(5);
  const [visible, setVisible] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      if (navigation.isFocused()) {
        dispatch(fetchOutfitsData(user.userInfo._id));
      }
    }, [navigation.isFocused()])
  );

  const handleAddItem = React.useCallback(() => {
    setVisible(true);
  }, [])

  const handleModelButtonPress = React.useCallback((index) => {
    setVisible(false);
    switch (index) {
      case 0:
        navigation.navigate('Outfit-new-wardrobe_config');
        break;
      case 1:
        navigation.navigate('Outfit-new-ai_config');
      default:
        break;
    }
  }, [])

  const onLayout = React.useCallback(() => {
    const { width } = Dimensions.get('window');
    const itemWidth = IMAGE_WIDTH
    const numColumns = Math.floor((width - 22) / itemWidth)
    setNumColumns(numColumns)
  }, [])

  return (
    <View style={styles.container} onLayout={onLayout}>
      <StatusBar barStyle="auto" />
      <Appbar.Header statusBarHeight={20} style={{ paddingBottom: 0 }}>
        <Appbar.Content title="Outfit" />
      </Appbar.Header>
      <View
        style={{ flex: 1 }}
      >
        <List.Section
          style={{ flex: 1 }}
        >
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
        </List.Section>
      </View>

      <AddOutfitModal visible={visible} setVisible={setVisible} handlePress={handleModelButtonPress} />

      <FAB
        style={styles.fab}
        icon={(props) => <Icon name="plus" {...props} />}
        onPress={handleAddItem}
      />

    </View>
  )
}

const AddOutfitModal = ({ visible, setVisible, handlePress }) => {
  const { colors } = useTheme();

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={() => setVisible(false)}
        contentContainerStyle={{
          display: 'flex',
          width: Dimensions.get('window').width * 0.8, height: Dimensions.get('window').height * 0.3,
          alignSelf: 'center',
        }}
      >
        <View style={{
          display: 'flex', flexDirection: 'column',
          backgroundColor: 'white',
          width: '100%', height: '100%',
          borderRadius: 10,
          padding: 10,
        }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: 'bold',
              width: '50%',
            }}>
            How do you want to create your outfit?
          </Text>
          <View style={{
            display: 'flex', alignItems: "center", justifyContent: "space-around",
            width: '100%', height: '80%',
            flexDirection: 'column',
          }}>
            <TouchableOpacity onPress={() => handlePress(0)}>
              <View style={{
                flex: 0, flexDirection: "column", alignItems: "center", justifyContent: "center",
                backgroundColor: colors.secondaryContainer,
                paddingHorizontal: '10%',
                paddingVertical: '5%',
                // borderColor: 'red', borderWidth: 2,
                borderRadius: 5,
              }}>
                {/* <Image source={{
                uri: 
              }}/> */}
                <Text>From My Wardrobe</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handlePress(1)}>
              <View style={{
                flex: 0, flexDirection: "column", alignItems: "center", justifyContent: "center",
                backgroundColor: colors.secondaryContainer,
                paddingHorizontal: '10%',
                paddingVertical: '5%',
                // borderColor: 'red', borderWidth: 2,
                borderRadius: 5,
              }}>
                <Text>Outfit Suggestions</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

      </Modal>
    </Portal>
  )
}