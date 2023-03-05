import { useState } from "react";
import { Button, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const Home = ({ navigation }) => {

  return (
    <View style={styles.container}>
      <Text>StylEase by No Brainer Team</Text>
      <StatusBar style="auto" />
    </View>
  );
}