import { useState, useEffect } from "react";
import { StyleSheet, Text, View, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useDispatch, useSelector } from "react-redux";
import { TextInput, Button } from 'react-native-paper';

import { fetchUserData } from "../stores/UserStore";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    marginBottom: 10,
  },
  button: {
    width: '100%',
    marginBottom: 10,
  },
});

export const LoginPage = ({ navigation }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.userInfo._id);
  const [content, setContent] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
  const handleSubmit = () => {
    // handle login submission here
  //   fetch('https://your-server.com/api/login', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     email,
  //     password,
  //   }),
  // })
  //   .then(response => {
  //     if (!response.ok) {
  //       throw new Error('Authentication failed');
  //     }
  //     // Handle successful authentication here, such as navigating to the home screen
  //     console.log('Successfully authenticated');
  //   })
  //   .catch(error => {
  //     // Handle authentication failure here, such as displaying an error message to the user
  //     console.error(error);
  //   });
    navigation.navigate('Main');
  };

  const handleSignup = () => {
    navigation.navigate('SignUp');
  };

  const handleForgotPassword = () => {
    // avigation.navigate('SignUp');
    // navigate to forgot password page here
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        style={styles.input}
      />
      <Button mode="contained" onPress={handleSubmit} style={styles.button}>
        Submit
      </Button>
      <Button onPress={handleSignup} style={styles.button}>
        Sign up
      </Button>
      <Button onPress={handleForgotPassword} style={styles.button}>
        Forgot password or username
      </Button>
    </View>
  );
};