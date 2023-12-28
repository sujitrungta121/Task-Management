import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import {hp, wp} from '../common/Responsive';

const NewProject = ({onAddProject}) => {
  const [newProjectName, setNewProjectName] = useState('');

  const handleAddProject = () => {
    if (newProjectName.trim() !== '') {
      onAddProject(newProjectName);
      setNewProjectName('');
    }
  };
  return (
    <View style={styles.wrapper}>
      <Text style={{fontSize: 20, color: 'black', fontWeight: 'bold'}}>
        Add New Project
      </Text>
      <View style={styles.input}>
        <TextInput
          placeholder="Enter your Project Name"
          value={newProjectName}
          onChangeText={text => setNewProjectName(text)}
        />
      </View>
      <Pressable
        style={{
          backgroundColor: '#0080FC',
          width: wp(30),
          padding: wp(2),
          borderRadius: 15,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={handleAddProject}>
        <Text style={{fontSize: 12}}>Add New Task</Text>
      </Pressable>
    </View>
  );
};
export default NewProject;

const styles = StyleSheet.create({
  wrapper: {
    width: '90%',
    height: '60%',
    display: 'flex',
    borderRadius: 5,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp(5),
    rowGap: 20,
  },
  input: {
    width: '90%',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    padding: 5,
  },
});
