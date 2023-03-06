import { useState } from "react";
import { StyleSheet, Text, View, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button } from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const Home = ({ navigation }) => {
  alertButtonAction = () => { 
    Alert.alert("Hello", "test", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
      { text: "OK", onPress: () => console.log("OK Pressed") }
    ]);
  }

  return (
    <View style={styles.container}>
      <Text>StylEase by No Brainer Team!!!</Text>
      <Button icon="cursor-pointer" mode="contained" onPress={alertButtonAction}>
        Press me
      </Button>
      <StatusBar style="auto" />
    </View>
  );
}