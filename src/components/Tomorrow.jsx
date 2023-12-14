import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
  Platform,
  FlatList,
} from 'react-native';
import Dots from '../common/Dots';
import Menus from './Menu';

const TomorrowTask = ({
  projects,
  setProjects,
  heading,
  filterType,
  searchQuery,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [inputText, setInputText] = useState('');
  const [clicked, setClicked] = useState(false);
  const [openedDotFileIndex, setOpenedDotFileIndex] = useState(null);
  const [editTaskId, setEditTaskId] = useState(null);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [visible, setVisible] = useState(false);
  const data = ['Highlights', 'Edit', 'Delete'];

  const handleInputChange = text => {
    setInputText(text);
  };

  const handleAddTask = () => {
    if (inputText.trim()) {
      const newTask = {
        id: Date.now(),
        task: inputText,
        isChecked: false,
        dueDate: today,
      };

      const updatedProjects = [...projects];
      const projectIndex = updatedProjects.findIndex(
        project => project.name === heading,
      );
      if (projectIndex !== -1) {
        const taskExists = updatedProjects[projectIndex].todayTasks.some(
          task =>
            task.task === newTask.task && task.dueDate === newTask.dueDate,
        );

        if (!taskExists) {
          updatedProjects[projectIndex].todayTasks.push(newTask);
          setProjects(updatedProjects);
          setInputText('');
        } else {
        }
      }
    } else {
      setIsChecked(!isChecked);
    }
  };

  const handleCheckBoxClick = (projectId, taskId) => {
    const updatedProjects = [...projects];
    const projectIndex = updatedProjects.findIndex(
      project => project.name === projectId,
    );
    if (
      projectIndex !== -1 &&
      updatedProjects[projectIndex].tomorrowTasks &&
      updatedProjects[projectIndex].tomorrowTasks.length > 0
    ) {
      const updatedTasks = [...updatedProjects[projectIndex].tomorrowTasks];
      const taskIndex = updatedTasks.findIndex(task => task.id === taskId);
      if (taskIndex !== -1) {
        updatedTasks[taskIndex].checkedIs = !updatedTasks[taskIndex].checkedIs;
        updatedProjects[projectIndex].tomorrowTasks = updatedTasks;
        setProjects(updatedProjects);
      }
    }
  };
  const handleInputSubmit = () => {
    if (editTaskId !== null && inputText.trim() !== '') {
      handleUpdateTask();
    } else if (!editTaskId && inputText.trim() !== '') {
      handleAddTask();
    }
  };

  const handleFileVisible = () => {
    setClicked(false);
  };
  const handleDotClick = index => {
    setOpenedDotFileIndex(index);
    setClicked(!clicked);
    setVisible(!visible);
  };

  const handleFilterSelection = (filter, index) => {
    if (filter === 'Edit') {
      setEditTaskId(index);
      setInputText(filteredTasks.find(task => task.id === index)?.task || '');

      handleFileVisible(false);
    } else if (filter === 'Delete') {
      const taskToDelete = filteredTasks.find(task => task.id === index);
      if (taskToDelete) {
        handleDeleteTask(project.name, taskToDelete.id);
      }
    } else if (filter === 'Highlights') {
      const updatedTasks = [...filteredTasks];
      const taskIndex = updatedTasks.findIndex(task => task.id === index);
      if (taskIndex !== -1) {
        updatedTasks[taskIndex].highlightIs =
          !updatedTasks[taskIndex].highlightIs;
        setFilteredTasks(updatedTasks);
      }
      handleFileVisible(false);
    } else if (filter === 'Move to Tomorrow') {
      handleFileVisible(false);
    }
  };
  const today = new Date();
  today.setDate(today.getDate() + 1);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const project = projects.find(project => project.name === heading);

  useEffect(() => {
    const filterTasks = () => {
      let tasks = [];

      if (filterType === 'Complete') {
        tasks = projects.reduce((accumulator, project) => {
          const tasksWithChecked = project.tomorrowTasks.filter(
            task => task.checkedIs,
          );
          accumulator.push(...tasksWithChecked);
          return accumulator;
        }, []);
      } else if (filterType === 'OutStanding') {
        tasks = project.tomorrowTasks.filter(task => task.highlightIs);
      } else {
        tasks = project.tomorrowTasks;
      }

      return tasks;
    };

    const filtered = filterTasks();
    setFilteredTasks(filtered);
  }, [projects, filterType, searchQuery]);

  const handleUpdateTask = () => {
    if (inputText.trim() && editTaskId !== null) {
      const updatedProjects = projects.map(project => {
        if (project.name === heading) {
          const updatedTasks = project.tomorrowTasks.map(task => {
            if (task.id === editTaskId) {
              return {...task, task: inputText};
            }
            return task;
          });
          return {...project, tomorrowTasks: updatedTasks};
        }
        return project;
      });

      setProjects(updatedProjects);
      setInputText('');
      setEditTaskId(null);
    }
  };

  const handleDeleteTask = (projectId, taskId) => {
    const updatedProjects = projects.map(project => {
      if (project.name === projectId) {
        const updatedTasks = project.tomorrowTasks.filter(
          task => task.id !== taskId,
        );
        return {...project, tomorrowTasks: updatedTasks};
      }
      return project;
    });

    setProjects(updatedProjects);
  };

  return (
    <View>
      <FlatList
        data={filteredTasks}
        keyExtractor={item => item.id.toString()}
        renderItem={({item, index}) => (
          <View
            style={[
              styles.tasksContainer,
              item.highlightIs && styles.highlightedTaskContainer,
            ]}>
            <TouchableOpacity
              style={{
                display: 'flex',
                flexDirection: 'row',
                columnGap: 20,
                alignItems: 'center',
              }}
              onPress={() => handleCheckBoxClick(project.name, item.id)}>
              <View
                style={[styles.checkBox, item.checkedIs && styles.checkedBox]}>
                {item.checkedIs && <Text style={styles.tick}>&#10003;</Text>}
              </View>
              {!editTaskId || editTaskId !== item.id ? (
                <Text
                  style={[
                    styles.taskText,
                    item.checkedIs && styles.lineThrough,
                  ]}>
                  {item.task}
                </Text>
              ) : (
                <TextInput
                  style={styles.editInput}
                  value={inputText}
                  onChangeText={handleInputChange}
                  onBlur={handleUpdateTask}
                  onSubmitEditing={handleInputSubmit}
                />
              )}
            </TouchableOpacity>

            <Pressable
              style={{position: 'relative'}}
              onPress={() => {
                handleDotClick(item.id);
              }}>
              <Dots />
            </Pressable>

            {openedDotFileIndex === item.id && (
              <Menus
                visible={visible}
                dotFileContainer={styles.dotFileContainer}
                setVisible={setVisible}
                data={data}
                onClick={filter => {
                  handleFilterSelection(filter, item.id, 'today');
                }}
              />
            )}
          </View>
        )}
      />
    </View>
  );
};

export default TomorrowTask;
const styles = StyleSheet.create({
  inputBox: {
    width: '100%',
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingLeft: 18,
    backgroundColor: '#E6E6EC',
  },
  placeholder: {
    fontStyle: 'italic',
    fontSize: 20,
  },
  firstBody: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  highlightedTaskContainer: {
    borderWidth: 1,
    borderColor: '#0080FC',
    backgroundColor: '#EBF5FF',
    borderRadius: 15,
    zIndex: 1,
    opacity: 1,
  },
  checkBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: '#0080FC',
  },
  tick: {
    color: 'white',
    fontSize: 14,
  },
  text: {
    color: 'gray',
  },

  dotFileContainer: {
    position: 'absolute',
    top: '100%',
    left: 10,
    zIndex: 20,
  },
  tasksContainer: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#FFF',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 13,
    zIndex: 1,
    marginTop: 20,

    ...Platform.select({
      android: {
        elevation: 5,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
    }),
  },
  taskText: {
    fontSize: 16,
    marginBottom: 5,
    color: 'black',
    borderRadius: 10,
    padding: 4,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  lineThrough: {
    textDecorationLine: 'line-through',
  },
});
