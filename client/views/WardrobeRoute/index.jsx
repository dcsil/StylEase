import React from "react";
import { useFocusEffect } from '@react-navigation/native';
import { View, FlatList, TouchableOpacity, Image, Dimensions, StatusBar, Text } from 'react-native';
import { Searchbar, FAB, List, Appbar, ActivityIndicator, MD2Colors } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';

import styles from './styles';

import { useDispatch, useSelector } from 'react-redux';
import { fetchWardrobeItems } from '../../stores/UserStore';
import { uploadWardrobeItem } from "../../api/requests";

import { BASE_URL } from '@env';


export const WardrobeRoute = ({ navigation }) => {
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [numColumns, setNumColumns] = React.useState(3);
  const [wardrobeLoaded, setWardrobeLoaded] = React.useState(false);

  const user = useSelector(state => state.user);
  const userId = user.userInfo._id;
  const wardrobeItems = user.userInfo.data ? user.userInfo.data.wardrobe.items : [];
  const userStoreLoading = useSelector(state => state.user.loading);

  useFocusEffect(
    React.useCallback(() => {
      if (navigation.isFocused()) {
        dispatch(fetchWardrobeItems(userId));
        setWardrobeLoaded(true);
      }
    }, [navigation.isFocused()])
  );

  const onLayout = () => {
    const { width } = Dimensions.get('window')
    const itemWidth = styles.image.width
    const numColumns = Math.floor(width / itemWidth)
    setNumColumns(numColumns)
  }

  // Function to handle adding a new wardrobe item
  const handleAddItem = async () => {
    // const { status } = await ImagePicker.requestCameraPermissionsAsync();
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    let result = { cancelled: true };
    if (status === 'granted') {
      result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        base64: true,
        aspect: [1, 1],
        quality: 0.5,
      });
    }

    if (!result.canceled) {
      const base64Image = `data:image/png;base64,${result.assets[0].base64}`;
      await uploadWardrobeItem(userId, base64Image);
      dispatch(fetchWardrobeItems(userId));
    }

  };

  // Function to render an individual wardrobe item
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Wardrobe-item', {
          item: item,
        })}
      >
        <Image
          source={{
            uri: `${BASE_URL}/api/GetItemImage/${item._id}`,
          }}
          style={styles.image} />
      </TouchableOpacity>
    );
  };

  return (
    < View style={styles.container} onLayout={onLayout} >
      <StatusBar barStyle="auto" />
      <Appbar.Header statusBarHeight={20} style={{ paddingBottom: 0 }}>
        <Appbar.Content title="Wordrobe" />
      </Appbar.Header>
      <View style={styles.searchBarContainer}>
        <Searchbar
          style={styles.searchBar}
          placeholder="..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        // inputStyle={{ height: 20 }}
        />
      </View>

      <List.Section style={styles.listSection}>
        <FlatList
          key={numColumns}
          style={styles.flatList}
          numColumns={numColumns}
          contentContainerStyle={styles.flatListContainer}
          data={wardrobeItems}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
        />
      </List.Section>

      <FAB
        style={styles.fab}
        icon={(props) => <Icon name="plus" {...props} />}
        onPress={handleAddItem}
      />
    </View >
  );

}