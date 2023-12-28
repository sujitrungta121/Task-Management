import React from 'react';
import {View} from 'react-native';
import {Menu, MenuItem} from 'react-native-material-menu';
import {wp} from '../common/Responsive';

const Menus = ({
  visible,
  setVisible,
  dotFileContainer,
  onClick,
  data,
  today,
}) => {
  const hideMenu = filter => {
    setVisible(false);
    onClick(filter);
  };
  const filteredData = today
    ? data
    : data.filter(item => item !== 'Move to Tomorrow');

  return (
    <View style={dotFileContainer}>
      <Menu
        visible={visible}
        onRequestClose={() => setVisible(false)}
        style={{position: 'absolute', width: '30%', left: wp(65)}}>
        {filteredData.map((item, index) => (
          <MenuItem key={index} onPress={() => hideMenu(item)}>
            {item}
          </MenuItem>
        ))}
      </Menu>
    </View>
  );
};

export default Menus;
