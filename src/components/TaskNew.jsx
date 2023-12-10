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
  ScrollView,
} from 'react-native';
import Dots from '../common/Dots';

import Menus from './Menu';
import {hp} from '../common/Responsive';
import TomorrowTask from './Tomorrow';

const TaskNew = ({projects, setProjects, heading, filterType, searchQuery}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [inputText, setInputText] = useState('');
  const [clicked, setClicked] = useState(false);
  const [checked, setChecked] = useState(false);
  const [openedDotFileIndex, setOpenedDotFileIndex] = useState(null);
  const [editTaskId, setEditTaskId] = useState(null);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [visible, setVisible] = useState(false);

  const data = ['Move to Tomorrow', 'Highlights', 'Edit', 'Delete'];

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
          console.log('Task already exists!');
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
      updatedProjects[projectIndex].todayTasks &&
      updatedProjects[projectIndex].todayTasks.length > 0
    ) {
      const updatedTasks = [...updatedProjects[projectIndex].todayTasks];
      const taskIndex = updatedTasks.findIndex(task => task.id === taskId);
      if (taskIndex !== -1) {
        updatedTasks[taskIndex].isChecked = !updatedTasks[taskIndex].isChecked;
        updatedProjects[projectIndex].todayTasks = updatedTasks;
        setProjects(updatedProjects);
      }
    }
  };

  const handleFileVisible = () => {
    setClicked(false);
  };
  const handleDotClick = index => {
    setOpenedDotFileIndex(index);
    setClicked(!clicked);
    setVisible(true);
  };

  const handleFilterSelection = (filter, index) => {
    if (filter === 'Edit') {
      setEditTaskId(index);
      setInputText(filteredTasks.find(task => task.id === index).task);
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
        updatedTasks[taskIndex].isHighlight =
          !updatedTasks[taskIndex].isHighlight;
        setFilteredTasks(updatedTasks);
      }
      handleFileVisible(false);
    } else if (filter === 'Move to Tomorrow') {
      const taskToMove = filteredTasks.find(task => task.id === index);
      console.log(taskToMove);
      if (taskToMove) {
        handleMoveToTomorrow(taskToMove);
      }
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
        console.log('complete is clicked');
        tasks = projects.reduce((accumulator, project) => {
          const tasksWithChecked = project.todayTasks.filter(
            task => task.isChecked,
          );
          accumulator.push(...tasksWithChecked);
          return accumulator;
        }, []);
      } else if (filterType === 'OutStanding') {
        tasks = project.todayTasks.filter(task => task.isHighlight);
      } else {
        tasks = project.todayTasks;
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
          const updatedTasks = project.todayTasks.map(task => {
            if (task.id === editTaskId) {
              return {...task, task: inputText};
            }
            return task;
          });
          return {...project, todayTasks: updatedTasks};
        }
        return project;
      });

      setProjects(updatedProjects);
      setInputText('');
      setEditTaskId(null);
    }
  };

  const handleMoveToTomorrow = task => {
    const updatedProjects = projects.map(project => {
      if (project.name === heading) {
        const updatedTodayTasks = project.todayTasks.filter(
          t => t.id !== task.id,
        );

        // Generate a new ID for the task being moved
        const newId = Date.now(); // You can use another method to generate a unique ID

        const updatedTomorrowTasks = [
          ...project.tomorrowTasks,
          {...task, id: newId, dueDate: tomorrow}, // Assign a new ID to the moved task
        ];

        return {
          ...project,
          todayTasks: updatedTodayTasks,
          tomorrowTasks: updatedTomorrowTasks,
        };
      }
      return project;
    });

    setProjects(updatedProjects);
  };
  const handleInputSubmit = () => {
    if (editTaskId !== null && inputText.trim() !== '') {
      handleUpdateTask();
    } else if (!editTaskId && inputText.trim() !== '') {
      handleAddTask();
    }
  };
  const handleDeleteTask = (projectId, taskId) => {
    const updatedProjects = projects.map(project => {
      if (project.name === projectId) {
        const updatedTasks = project.todayTasks.filter(
          task => task.id !== taskId,
        );
        return {...project, todayTasks: updatedTasks};
      }
      return project;
    });

    setProjects(updatedProjects);
  };

  return (
    <View
      style={{
        height: '100%',
        gap: 10,
      }}>
      <View style={styles.inputBox}>
        <View style={styles.firstBody}>
          <TouchableOpacity
            onPress={() => handleAddTask()}
            accessible={true}
            accessibilityRole={'checkbox'}
            accessibilityState={{checked: checked}}>
            <View style={[styles.checkBox, checked && styles.checkedBox]}>
              {isChecked && <Text style={styles.tick}>&#10003;</Text>}
            </View>
          </TouchableOpacity>

          <TextInput
            style={[styles.box, isChecked ? styles.text : null]}
            placeholder="Add New Task..."
            onChangeText={handleInputChange}
            value={inputText}
            onSubmitEditing={handleInputSubmit}
          />
        </View>
      </View>
      <ScrollView style={{maxHeight: hp(50)}}>
        <FlatList
          data={filteredTasks}
          keyExtractor={item => item.id.toString()}
          renderItem={({item, index}) => (
            <View
              style={[
                styles.tasksContainer,
                item.isHighlight && styles.highlightedTaskContainer,
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
                  style={[
                    styles.checkBox,
                    item.isChecked && styles.checkedBox,
                  ]}>
                  {item.isChecked && <Text style={styles.tick}>&#10003;</Text>}
                </View>
                {!editTaskId || editTaskId !== item.id ? (
                  <Text
                    style={[
                      styles.taskText,
                      item.isChecked && styles.lineThrough,
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
                onPress={() => handleDotClick(item.id)}>
                <Dots />
              </Pressable>

              {clicked && openedDotFileIndex === item.id && (
                <Menus
                  visible={visible}
                  dotFileContainer={styles.dotFileContainer}
                  setVisible={setVisible}
                  data={data}
                  onClick={filter => handleFilterSelection(filter, item.id)}
                />
              )}
            </View>
          )}
        />
        <TomorrowTask
          projects={projects}
          filterType={filterType}
          setProjects={setProjects}
          heading={heading}
          searchQuery={searchQuery}
        />
      </ScrollView>
    </View>
  );
};

export default TaskNew;
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
  container: {
    flex: 1,
    padding: 10,
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
    opacity: 5,
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
