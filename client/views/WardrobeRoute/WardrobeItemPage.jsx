import React from 'react';
import { StatusBar, StyleSheet, View, Text, Dimensions, Image } from 'react-native';
import { Button, Appbar, List } from 'react-native-paper';
import { BASE_URL } from '@env';


export const WardrobeItemPage = ({ route, navigation }) => {
  const { item } = route.params;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="auto" />
      <Appbar.Header statusBarHeight={20} style={{ paddingBottom: 0 }}>
        <Appbar.BackAction onPress={() => { navigation.goBack() }} />
        <Appbar.Content title="Item Details" />
      </Appbar.Header>
      {/* <Text>{JSON.stringify(item)}</Text> */}
      <Image
        source={{
          uri: `${BASE_URL}/api/GetItemImage/${item._id}`,
        }}
        style={styles.image} />
      <View>
        <List.Section  style={styles.listContainer}>
          <List.Subheader>Details</List.Subheader>
          {item.name && <List.Item
            left={() => <Text style={styles.itemLeft}>Name</Text>}
            right={() => <Text style={styles.itemRight}>{item.name}</Text>} />}
          {item.brand && <List.Item
            left={() => <Text style={styles.itemLeft}>Brand</Text>}
            right={() => <Text style={styles.itemRight}>{item.brand}</Text>} />}
          {item.type && <List.Item
            left={() => <Text style={styles.itemLeft}>Type</Text>}
            right={() => <Text style={styles.itemRight}>{item.type}</Text>} />}
          {item.color && <List.Item
            left={() => <Text style={styles.itemLeft}>Color</Text>}
            right={() => <Text style={styles.itemRight}>{item.color}</Text>} />}
        </List.Section>
      </View>

    </View>
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
