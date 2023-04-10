import React from 'react';
import { View, FlatList, TouchableOpacity, Image, Dimensions, StatusBar, Text, StyleSheet, ScrollView, VirtualizedList } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Appbar, List, Button, IconButton, TextInput } from 'react-native-paper';

import styles from './outfitEditStyles';
import { useDispatch, useSelector } from 'react-redux';

import { imageUriParser } from '../../utils/urlParser';
import { useFocusEffect } from '@react-navigation/native';
import { fetchOutfitsData, fetchWardrobeItems } from '../../stores/UserStore';
import { uploadOutfit } from '../../api/requests';
import { DefaultAppBar } from '../../components/DefaultAppbar';
import { RenderItem } from './RenderItem';
import { calculateNumCol } from '../../utils/layout';

export const OutfitEditPage_wardrobe = ({ route, navigation }) => {
  const { outfit } = route.params;
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  useFocusEffect(
    React.useCallback(() => {
      if (navigation.isFocused()) {
        dispatch(fetchWardrobeItems(user.userInfo._id));
      }
    }, [navigation.isFocused()])
  );

  // #region Bottom Sheet Modal
  // ref
  const bottomSheetModalRef = React.useRef(null);
  // variables
  const ogWardrobeItems = React.useMemo(() => user.userInfo.data && user.userInfo.data.wardrobe.items ? user.userInfo.data.wardrobe.items : [], [user.userInfo.data]);
  const [wardrobeItems, setWardrobeItems] = React.useState(ogWardrobeItems.map(item => { return { ...item, checked: false } }));
  const snapPoints = React.useMemo(() => ['25%', '50%', '75%'], []);

  // hooks
  React.useEffect(() => {
    if (bottomSheetModalRef.current) {
      bottomSheetModalRef.current.present();
    }

    return () => {
      if (bottomSheetModalRef.current) {
        bottomSheetModalRef.current.dismiss();
      }
    }
  }, [])

  React.useEffect(() => {
    setWardrobeItems(ogWardrobeItems.map(item => { return { ...item, checked: false } }))
  }, [ogWardrobeItems])

  // callbacks
  const handleConfirm = async () => {
    bottomSheetModalRef.current.dismiss();
    // TODO: Upload new outfit to server
    const outfitTBS = {
      ...outfit,
      items: wardrobeItems.filter(item => item.checked).map(item => item._id),
      creator: user.userInfo._id,
    };
    await uploadOutfit(outfitTBS, user.userInfo.data.outfits_collections[0].name);
    dispatch(fetchOutfitsData(user.userInfo._id));
    navigation.navigate('Outfit');
  };

  // #endregion

  // #region Tab View
  // Wardrobe Tab
  const WardrobeTab = ({ wardrobeItems, setWardrobeItems }) => {
    const [numColumns, setNumColumns] = React.useState(5);
    const onLayout = () => setNumColumns(calculateNumCol(Dimensions, styles.image.width));
    return (
      <View style={{ flex: 1 }}>
        {/* <Text>{ JSON.stringify(wardrobeItems) }</Text> */}
        <List.Section style={styles.listSection} onLayout={onLayout}>
          {wardrobeItems.length === 0 ? (
            <Text style={{ marginTop: 50 }}>No item found.</Text>
          ) : (
            <FlatList
              key={numColumns}
              style={styles.flatList}
              numColumns={numColumns}
              directionalLockEnabled={true}
              data={wardrobeItems}
              renderItem={({ item }) => <RenderItem item={item} setWardrobeItems={setWardrobeItems} imgSize={80} imgStyle={styles.image}/>}
              keyExtractor={(item) => item._id}
            />
          )}
        </List.Section>
      </View>
    )
  };

  // Tab View
  const [tabIndex, setTabIndex] = React.useState(0);

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <DefaultAppBar title="New Outfit" backActionCallback={() => { navigation.goBack() }}/>

        <View style={{ flex: 0.75 }}>
          {/* <Text>{ JSON.stringify(tempOutfit) }</Text> */}
          <View style={{
            display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
            marginVertical: 5,
            // borderColor: 'black', borderWidth: 2,
          }}>
            <Text style={{
              fontSize: 20,
              // letterSpacing: 2,
              marginRight: 10,
            }}>{`Save as:`}</Text>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginRight: 10,
            }}>{`${outfit.name}`}</Text>
            <IconButton icon={() => <Icon name='check' color='green' size={30} />} onPress={handleConfirm} />
          </View>
          <List.Section style={styles.listSection}>
            <FlatList
              // key={`${displayedItems.length}items`}
              contentContainerStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              style={styles.flatList}
              numColumns={1}
              directionalLockEnabled={true}
              data={wardrobeItems.filter(item => item.checked)}
              renderItem={({ item }) => (
                <View style={styles.imageWrapper}>
                  <Image
                    source={{
                      uri: imageUriParser(item._id),
                    }}
                    style={styles.displayImage} />
                </View>
              )}
              keyExtractor={(item) => item._id}
            />
          </List.Section>
        </View>

        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          enablePanDownToClose={false}
          enableContentPanningGesture={false}
        >
          <View style={{ flex: 1 }}>
            <View style={{ flex: 0, flexDirection: 'row', marginVertical: 5 }}>
              <View style={{ borderBottomColor: tabIndex === 0 ? 'grey' : 'transparent', borderBottomWidth: 1 }}>
                <Button
                  onPress={() => setTabIndex(0)}
                  disabled={tabIndex === 0}
                >
                  My Wardrobe
                </Button>
              </View>
              {/* <View style={{ borderBottomColor: tabIndex === 1 ? 'grey' : 'transparent', borderBottomWidth: 1 }}>
                <Button
                  onPress={() => setTabIndex(1)}
                  disabled={tabIndex === 1}
                >
                  Recommendation
                </Button>
              </View> */}
            </View>
            <View style={{ flex: 1, paddingHorizontal: 5 }}>
              {tabIndex === 0 && (<WardrobeTab wardrobeItems={wardrobeItems} setWardrobeItems={setWardrobeItems} />)}
              {/* {tabIndex === 1 && (<RecommendTab wardrobeItems={wardrobeItems} setWardrobeItems={setWardrobeItems} />)} */}
            </View>
          </View>
        </BottomSheetModal>

      </View>
    </BottomSheetModalProvider>
  )
}