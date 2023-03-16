import { useState, useEffect } from "react";
import { StyleSheet, Text, View, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button } from 'react-native-paper';

import { getName } from "../api/temp";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const LoginPage = ({ navigation }) => {
  const [content, setContent] = useState('')
  useEffect(() => {
    getName("Taylor Scott").then((result) => {
      setContent(result);
    });
  }, [])

  const alertButtonAction = () => { 
    Alert.alert("Hello", "test login", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
      { text: "Log Me In", onPress: () => navigation.navigate('Main') }
    ]);
  }

  return (
    <View style={styles.container}>
      <Text>StylEase by No Brainer Team!!!</Text>
      {/* <Text>{`Content from server: ${content}`}</Text> */}
      <Button icon="cursor-pointer" mode="contained" onPress={alertButtonAction}>
        Login
      </Button>
      <StatusBar style="auto" />
    </View>
  );
}