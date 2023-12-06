import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';

const NewProject = ({onAddProject}) => {
  const [newProjectName, setNewProjectName] = useState('');

  const handleAddProject = () => {
    if (newProjectName.trim() !== '') {
      onAddProject(newProjectName); // Pass the new project name to the parent component
      setNewProjectName(''); // Clear the input after adding the project
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
          backgroundColor: 'blue',
          width: '40%',
          padding: 5,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={handleAddProject}>
        <Text style={{fontSize: 16}}>Add New Task</Text>
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
    padding: 15,
    rowGap: 20,
  },
  input: {
    width: '90%', // Adjust the width as needed
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    // padding: 5,
  },
});
