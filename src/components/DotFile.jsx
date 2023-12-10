import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from 'react-native';

const DotFile = ({data, onClick}) => {
  const handleFilterSelection = filterType => {
    onClick(filterType);
  };
  return (
    <View style={styles.wrapper}>
      {data.map((filter, index) => (
        <Pressable
          key={index}
          style={{display: 'flex', padding: 3}}
          onPress={() => handleFilterSelection(filter)}>
          <Text style={{color: '#111111', fontSize: 15}}>{filter}</Text>
        </Pressable>
      ))}
    </View>
  );
};

export default DotFile;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 30,
    width: '100%',
    borderRadius: 10,
    // maxHeight: 500,
    zIndex: 20,
    overFlow: 'scroll',
  },
  normalText: {
    fontSize: 16,
    color: 'black',
    marginBottom: 5,
  },
});
