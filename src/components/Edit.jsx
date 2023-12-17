import React, {useState, useEffect} from 'react';
import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import axios from 'axios';

const Edit = ({open, projects, setProjects, selectedProject, id}) => {
  const [editedProject, setEditedProject] = useState(selectedProject || '');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const projectTasks =
      projects.find(proj => proj.name === selectedProject)?.tasks || [];
    setTasks(projectTasks);
  }, [selectedProject, projects]);

  const handleProject = project => {
    setEditedProject(project);
  };

  const handleUpdateProject = async () => {
    if (editedProject.trim() !== '') {
      try {
        const index = projects.findIndex(
          project => project.todoName === selectedProject,
        );
        const userId = projects[index].userId;
        const todoId = projects[index]._id;

        const response = await axios.patch(
          'https://todo-backend-daem.vercel.app/update-todo',
          {
            userId: id,
            todoId: todoId,
            todoName: editedProject,
          },
        );

        const updatedData = response.data.todo;
        setProjects(prevProjects => {
          const updatedProjects = prevProjects.map(project => {
            if (project._id === updatedData._id) {
              return updatedData;
            }
            return project;
          });
          return updatedProjects;
        });

        open(false);
      } catch (error) {
        console.log('Error in updating', error);
      }
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
