import React from 'react';
import { StatusBar, StyleSheet, View, Text } from 'react-native';
import { Button, Appbar } from 'react-native-paper';

export const WardrobeItemPage = ({ route, navigation }) => {
  const { item } = route.params;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="auto" />
      <Appbar.Header statusBarHeight={20} style={{ paddingBottom: 0 }}>
        <Appbar.BackAction onPress={() => { navigation.goBack() }} />
        <Appbar.Content title="Cloth Details" />
      </Appbar.Header>
      <Text>{JSON.stringify(item)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  }
});
