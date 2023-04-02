import { useState, useEffect } from "react";
import { StyleSheet, Text, View, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button } from 'react-native-paper';
import { useDispatch, useSelector } from "react-redux";

import { fetchUserData } from "../stores/UserStore";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const LoginPage = ({ navigation }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.userInfo._id);
  const [content, setContent] = useState('')
  // useEffect(() => {
  //   getName("Taylor Scott").then((result) => {
  //     setContent(result);
  //   });
  // }, [])

  const alertButtonAction = () => {
    Alert.alert("Hello", "test login", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
      {
        text: "Confirm", onPress: () => {
          // console.log(userId);
          dispatch(fetchUserData(userId));
          navigation.navigate('Main');
        }
      }
    ]);
  }

  return (
    <View style={styles.container}>
      <Text>StylEase</Text>
      {/* <Text>{`userId: ${userId}`}</Text> */}
      <Button icon="cursor-pointer" mode="contained" onPress={alertButtonAction}>
        Login
      </Button>
      <StatusBar style="auto" />
    </View>
  );
}