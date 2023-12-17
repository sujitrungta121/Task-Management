import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Dots from '../common/Dots';
import DotFile from './DotFile';
import arrow from '../assets/back-arrow.png';
import Edit from './Edit';
import NewProject from './NewProject';
import axios from 'axios';

const Projects = ({navigation, projects, setProjects, id}) => {
  const [dotFileVisible, setDotFileVisible] = useState(false);
  const [openProjectIndex, setOpenProjectIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [openNew, setOpenNew] = useState(false);
  const [apiData, setApiData] = useState([]);
  const [postApiData, setPostApiData] = useState([]);

  const handleFileVisible = () => {
    setDotFileVisible(false);
  };

  const handleUpdateProjects = newData => {
    setProjects([...projects, newData]);
  };
  const handleDeleteProject = async index => {
    console.log(index, projects[index]);
    const Id = projects[index]._id;
    console.log(Id, id);
    try {
      await axios.delete('https://todo-backend-daem.vercel.app/delete-todo', {
        data: {
          userId: id,
          todoId: Id,
        },
      });

      // console.log(response.data);
      const updatedProjects = projects.filter((_, i) => i !== index);
      console.log(updatedProjects);
      setProjects(updatedProjects);
    } catch (error) {
      console.error('Error deleting project:', error.message);
    }
  };

  const handleFilterSelection = (filterType, index) => {
    if (filterType === 'Edit') {
      setModalVisible(true);
      setSelectedProject(projects[index].todoName);
    } else if (filterType === 'Delete') {
      Alert.alert(
        'Delete Project',
        `Are you sure you want to delete '${projects[index].todoName}'?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => handleDeleteProject(index),
          },
        ],
        {cancelable: false},
      );
    }
    handleFileVisible();
  };

  const openDots = index => {
    setOpenProjectIndex(index === openProjectIndex ? null : index);
    setDotFileVisible(true);
  };

  const addNew = () => {
    setOpenNew(true);
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const closeNew = () => {
    setOpenNew(false);
  };
  const handleAddNewProject = async projectName => {
    try {
      const response = await axios.post(
        `http://todo-backend-daem.vercel.app/post-todo`,
        {
          userId: id,
          todoName: projectName,
        },
      );
      const newProject = response.data.todo;
      const updatedProjects = [...projects];
      updatedProjects.push({...newProject});
      setProjects(updatedProjects);
    } catch (error) {
      console.log('errror in adding', error);
    }
    setOpenNew(false);
  };

  const dotsData = ['Edit', 'Delete'];

  return (
    <ScrollView style={styles.wrapper}>
      <View style={styles.header}>
        <Pressable
          onPress={() =>
            projects.length <= 0
              ? Alert.alert(
                  'There is no project to show please add a new Project',
                )
              : navigation.navigate('main', {
                  projectName: projects[0]?.todoName,
                })
          }>
          <Image source={arrow} />
        </Pressable>
        <Text style={{color: '#0080FC', fontSize: 20}}>Projects</Text>
      </View>
      <View style={styles.projectDesc}>
        {projects?.map((project, index) => (
          <View style={styles.project} key={project.id}>
            <Pressable
              onPress={() => {
                navigation.navigate('main', {projectName: project.todoName});
              }}>
              <Text style={styles.projectText}>{project.todoName}</Text>
            </Pressable>
            <Pressable
              onPress={() => openDots(project._id)}
              style={{cursor: 'pointer'}}>
              <Dots />
            </Pressable>
            {dotFileVisible && openProjectIndex === project._id && (
              <View style={styles.dotFileWrapper}>
                <DotFile
                  data={dotsData}
                  onClick={filterType =>
                    handleFilterSelection(filterType, index)
                  }
                  onClose={handleFileVisible}
                />
              </View>
            )}
          </View>
        ))}

        <Pressable onPress={addNew}>
          <Text style={{fontSize: 24, fontFamily: 'Poppins', fontWeight: 500}}>
            + Add New
          </Text>
        </Pressable>
        <Modal
          animationType="slide"
          visible={modalVisible}
          onRequestClose={handleClose}>
          <View style={styles.modalContainer}>
            <Edit
              open={setModalVisible}
              projects={projects}
              id={id}
              setProjects={setProjects}
              selectedProject={selectedProject}
            />
          </View>
        </Modal>
        <Modal
          animationType="slide"
          visible={openNew}
          onRequestClose={closeNew}>
          <View style={styles.modalContainer}>
            <NewProject
              open={setOpenNew}
              data={projects}
              setData={handleUpdateProjects}
              selectedProject={selectedProject}
              onAddProject={handleAddNewProject}
            />
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

export default Projects;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    padding: 20,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    columnGap: 10,
    alignItems: 'center',
  },
  projectText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  projectDesc: {
    padding: 30,
    display: 'flex',
    rowGap: 40,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  project: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  dotFileWrapper: {
    position: 'absolute',
    top: '100%',
    right: 0,
    top: '56%',
    zIndex: 1,
  },
});
