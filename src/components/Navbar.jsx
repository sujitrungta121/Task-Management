import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Hamberger from './Projects';
import hamberger from '../assets/hamberger-menu.png';
import arrow from '../assets/back-arrow.png';
import userAvatar from '../assets/user-avatar.png';
import searchIcon from '../assets/search-icon.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
const removeData = async () => {
  try {
    await AsyncStorage.removeItem('today'); // Replace '@key' with the key to remove
    console.log('Data removed successfully!');
  } catch (error) {
    console.log('Error removing data:', error);
  }
};

const Navbar = ({navigation, searchQuery, setSearchQuery, projects}) => {
  const [isSignOut, setSignOut] = useState(true);

  const handleInputChange = text => {
    setSearchQuery(text);
  };
  useEffect(() => {}, [searchQuery]);
  const signOut = () => {
    Alert.alert(
      'Log out',
      `Are you sure you want to logout?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            removeData();
            navigation.navigate('login');
          },
        },
      ],
      {cancelable: false},
    );
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.wrapper}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            columnGap: 10,
            alignItems: 'center',
          }}>
          <Pressable onPress={() => navigation.navigate('projects')}>
            <Image source={hamberger} />
          </Pressable>
          <View style={styles.inputBox}>
            <Image source={searchIcon} />
            <TextInput
              placeholder="search"
              value={searchQuery}
              onChangeText={handleInputChange}
            />
          </View>
        </View>
        <Pressable onPress={signOut}>
          <Image source={userAvatar} />
        </Pressable>
        {!isSignOut && (
          <View>
            <Text>signed out</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Navbar;

const shadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  android: {
    elevation: 2,
  },
});

const bottomShadow = {
  ...Platform.select({
    ios: {
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    android: {
      elevation: 1,
    },
  }),
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? 10 : 0,
  },
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...bottomShadow,
  },
  inputBox: {
    width: '75%',
    borderWidth: 2,
    borderColor: '#F5F5F5',
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: 10,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
