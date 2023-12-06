// Projects.js
import React, {useState} from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Dots from '../common/Dots';
import DotFile from './DotFile';
import arrow from '../assets/back-arrow.png';
import Edit from './Edit';
import NewProject from './NewProject';

const Projects = ({navigation, projects, setProjects}) => {
  // const navigation=useNavigation();
  // const [projects, setProjects] = useState([
  //   {
  //     name: 'Website Task',
  //     tasks: [
  //       {
  //         id: 1,
  //         dueDate: 'today',
  //         task: 'task1',
  //       },
  //       {
  //         id: 2,
  //         dueDate: 'today',
  //         task: 'task1',
  //       },
  //       {
  //         id: 3,
  //         dueDate: 'today',
  //         task: 'task1',
  //       },
  //     ],
  //   },
  //   {name: 'Solar Project', tasks: ['Task 1']},
  //   {name: 'Personal Project', tasks: ['Task 1', 'Task 2', 'Task 3']},
  //   {name: 'Abc leads', tasks: []},
  // ]);
  const [dotFileVisible, setDotFileVisible] = useState(false);
  const [openProjectIndex, setOpenProjectIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [openNew, setOpenNew] = useState(false);

  const handleFileVisible = () => {
    setDotFileVisible(false);
  };

  const handleUpdateProjects = newData => {
    setProjects(newData);
  };

  const handleFilterSelection = (filterType, index) => {
    if (filterType === 'Edit') {
      setModalVisible(true);
      setSelectedProject(projects[index].name);
    } else if (filterType === 'Delete') {
      Alert.alert(
        'Delete Project',
        `Are you sure you want to delete '${projects[index].name}'?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              const updatedProjects = [...projects];
              updatedProjects.splice(index, 1);
              setProjects(updatedProjects);
            },
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
  const handleAddNewProject = projectName => {
    const newProject = {name: projectName, tasks: []};
    setProjects([...projects, newProject]);
    setOpenNew(false);
  };
  const dotsData = ['Edit', 'Delete'];

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Pressable
          onPress={() =>
            navigation.navigate('main', {projectName: projects[0].name})
          }>
          <Image source={arrow} />
        </Pressable>
        <Text style={{color: '#0080FC', fontSize: 20}}>Projects</Text>
      </View>
      <View style={styles.projectDesc}>
        {projects.map((project, index) => (
          <View style={styles.project} key={project.id}>
            <Pressable
              onPress={() => {
                // console.log(project.name)
                navigation.navigate('main', {projectName: project.name});
              }}>
              <Text style={styles.projectText}>{project.name}</Text>
            </Pressable>
            <Pressable
              onPress={() => openDots(index)}
              style={{cursor: 'pointer'}}>
              <Dots />
            </Pressable>
            {dotFileVisible && openProjectIndex === index && (
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
              data={projects}
              setData={handleUpdateProjects}
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
    </View>
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
    position: 'relative', // Added position relative for parent container
  },
  dotFileWrapper: {
    position: 'absolute',
    top: '100%', // Positioning the modal below the dots icon
    right: 0,
    top: '56%',
    zIndex: 1, // Ensure the modal is above other elements
  },
});
