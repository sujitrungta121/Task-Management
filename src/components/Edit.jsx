import React, {useState, useEffect} from 'react';
import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';

const Edit = ({open, data, setData, selectedProject}) => {
  const [editedProject, setEditedProject] = useState(selectedProject || '');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const projectTasks =
      data.find(proj => proj.name === selectedProject)?.tasks || [];
    setTasks(projectTasks);
  }, [selectedProject, data]);

  const handleProject = project => {
    setEditedProject(project);
  };

  const handleUpdateProject = () => {
    if (editedProject.trim() !== '') {
      const updatedData = data.map(project =>
        project.name === selectedProject
          ? {...project, name: editedProject, tasks: tasks}
          : project,
      );
      setData(updatedData);
      open(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text style={{fontWeight: 'bold', fontSize: 20}}>
        {selectedProject ? 'Edit Project' : 'Add New Project'}
      </Text>
      <View style={styles.inputBox}>
        <TextInput
          placeholder="Name of your Project"
          onChangeText={handleProject}
          value={editedProject}
        />
      </View>

      <Pressable style={styles.updateButton} onPress={handleUpdateProject}>
        <Text style={{fontSize: 20, color: 'white'}}>Update Project</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '80%',
    height: '90%',
    backgroundColor: 'white',
    margin: 'auto',

    padding: 10,
  },
  inputBox: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 4,
    marginVertical: 6,
  },
  button: {
    backgroundColor: 'blue',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
  },
  editButton: {
    color: 'blue',
    marginRight: 10,
  },
  deleteButton: {
    color: 'red',
    marginRight: 10,
  },
  updateButton: {
    backgroundColor: 'blue',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    alignSelf: 'center',
  },
});

export default Edit;
