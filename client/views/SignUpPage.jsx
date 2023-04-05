import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useDispatch, useSelector } from "react-redux";
import { SignUp } from '../api/requests';

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

export const SignupPage = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isValidInfo = () => {
    if (!name || !email || !password || !confirmPassword) {
      return false;
    }
    if (password !== confirmPassword) {
      return false;
    }
    return true;
  }

  const handleSignup = async () => {
    // handle sign up submission here
    await SignUp(name, email, password);
    navigation.navigate('Login');
  };

  const handleLogin = () => {
    navigation.navigate('Login'); // navigate back to the login page
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
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
      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={true}
        style={styles.input}
      />
      <Button disabled={!isValidInfo} mode="contained" onPress={handleSignup} style={styles.button}>
        Sign up
      </Button>
      <Button onPress={handleLogin} style={styles.button}>
        Login
      </Button>
    </View>
  );
};
