import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native';
import axios from 'axios';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const registerUser = () => {
    Alert.alert(
      'Delete Project',
      `You are not registered. Do you want to register yourself?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            navigation.navigate('signup');
          },
        },
      ],
      {cancelable: false},
    );
  };

  const handleLogin = async () => {
    if (password && email) {
      try {
        await axios.post('https://todo-backend-daem.vercel.app/login', {
          email: email,
          password: password,
        });
        navigation.navigate('projects');
        setEmail('');
        setPassword('');
      } catch (error) {
        console.error('Error during registration:', error.message);
        registerUser();
      }
    } else {
      Alert.alert('please fill all the required fields');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
      <Text style={styles.signupText}>
        Don't have an account?{' '}
        <Text style={styles.link} onPress={() => navigation.navigate('signup')}>
          Sign Up
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  signupText: {
    marginTop: 20,
  },
  link: {
    color: 'blue',
  },
});

export default LoginScreen;
