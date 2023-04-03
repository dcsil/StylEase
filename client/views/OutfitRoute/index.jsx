import { Appbar, Button, Card, FAB } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import styles from './styles';
import { StatusBar, View } from 'react-native';
import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOutfitsData } from '../../stores/UserStore';
import { imageUriParser } from '../../utils/urlParser';

export const OutfitRoute = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const outfits = React.useMemo(() =>
    user.userInfo.data && user.userInfo.data.outfits_collections ? user.userInfo.data.outfits_collections : [], [user.userInfo.data]
  );

  useFocusEffect(
    React.useCallback(() => {
      if (navigation.isFocused()) {
        dispatch(fetchOutfitsData(user.userInfo._id));
      }
    }, [navigation.isFocused()])
  );

  const handleAddItem = React.useCallback(() => {
    navigation.navigate('Outfit-new', {
      outfit: {
        _id: '1',
        items: [],
      },
    })
  }, [])

  return (
    <View style={styles.container}>
      <StatusBar barStyle="auto" />
      <Appbar.Header statusBarHeight={20} style={{ paddingBottom: 0 }}>
        <Appbar.Content title="Outfit" />
      </Appbar.Header>

      <View>
        <List.Section
        // style={styles.listSection}
        >
          <FlatList
            // key={`${displayedItems.length}items`}
            // style={styles.flatList}
            numColumns={1}
            directionalLockEnabled={true}
            data={outfits[0].outfits}
            renderItem={({ outfit }) => (
              <Card
                style={styles.card}
              >
                <Card.Cover
                  source={outfit.items.length === 0 ? { uri: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Color-blue.JPG?20100811194351' } : outfit.items.map(item => ({ uri: imageUriParser(item._id) })).slice(0, 3)}
                />
                <Card.Title title={outfit.name ? outfit.name : `Outfit(${outfit._id})`} />
              </Card>
            )}
            keyExtractor={(item) => item._id}
          />
        </List.Section>
      </View>

      <FAB
        style={styles.fab}
        icon={(props) => <Icon name="plus" {...props} />}
        onPress={handleAddItem}
      />

    </View>
  )
}