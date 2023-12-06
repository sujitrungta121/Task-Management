import React from 'react';
import {StyleSheet, View} from 'react-native';

const Dots = ({color}) => {
  return (
    <View style={styles.dotContainer}>
      <View style={[styles.dots, {backgroundColor: color || 'black'}]} />
      <View style={[styles.dots, {backgroundColor: color || 'black'}]} />
      <View style={[styles.dots, {backgroundColor: color || 'black'}]} />
    </View>
  );
};
export default Dots;

const styles = StyleSheet.create({
  dots: {
    width: 5,
    height: 5,
    borderRadius: 5,
  },
  dotContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
  },
});
