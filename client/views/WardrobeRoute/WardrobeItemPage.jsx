import React from 'react';
import { StatusBar, StyleSheet, View, Text, Dimensions, Image } from 'react-native';
import { Button, Appbar, List } from 'react-native-paper';
import { BASE_URL } from '@env';
import { DefaultAppBar } from '../../components/DefaultAppbar';


export const WardrobeItemPage = ({ route, navigation }) => {
  const { item } = route.params;

  return (
    <View style={styles.container}>
      <DefaultAppBar title="Item Details" backActionCallback={() => { navigation.goBack() }} />
      {/* <Text>{JSON.stringify(item)}</Text> */}
      <Image
        source={{
          uri: `${BASE_URL}/api/GetItemImage/${item._id}`,
        }}
        style={styles.image} />
      <View>
        <List.Section style={styles.listContainer}>
          <List.Subheader>Details</List.Subheader>
          {item.name && <ItemDetailLine title="Name" value={item.name} />}
          {item.brand && <ItemDetailLine title="Brand" value={item.brand} />}
          {item.type && <ItemDetailLine title="Type" value={item.type} />}
          {item.color && <ItemDetailLine title="Color" value={item.color} />}
        </List.Section>
      </View>

    </View>
  )
}

const ItemDetailLine = ({ title, value }) => {
  return (
    <List.Item
      left={() => <Text style={styles.itemLeft}>Type</Text>}
      right={() => <Text style={styles.itemRight}>{value}</Text>}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  image: {
    width: Dimensions.get('window').width,
    height: '40%',
    resizeMode: 'stretch',
  },
  listContainer: {
    // justifyContent: 'center',

    // borderColor: 'red',
    // borderWidth: 1,

  },
  itemLeft: {
    marginLeft: 20,
    fontWeight: 'bold',
  },
  itemRight: {
    marginRight: 20,
  }
});
