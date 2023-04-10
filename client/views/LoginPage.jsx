import { useState, useEffect } from "react";
import { StyleSheet, Text, View, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useDispatch, useSelector } from "react-redux";
import { TextInput, Button, useTheme } from 'react-native-paper';

import { fetchUserData, setUserId } from "../stores/UserStore";
import { Login } from "../api/requests";

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
    marginVertical: 10,
  },
});

export const LoginPage = ({ navigation }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.userInfo._id);
  const [content, setContent] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {colors} = useTheme();
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
  const handleSubmit = async () => {
    const { userid } = await Login(email, password);
    console.log(userid);
    await new Promise((resolve) => resolve(dispatch(setUserId(userid))))
      .then(() => {
        dispatch(fetchUserData(userid));
      })
      .then(() => {
        navigation.navigate('Main');
      });
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
      <Text style={{
        color: colors.primary,
        fontSize: 50,
        fontWeight: 'bold',
        marginBottom: 50,
      }}>StylEase</Text>
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
      <Button disabled={!email || !password} mode="contained" onPress={handleSubmit} style={styles.button}>
        Login
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